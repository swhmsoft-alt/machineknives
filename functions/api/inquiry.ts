/**
 * Cloudflare Pages Function — /api/inquiry
 *
 * Receives the KAIPU industrial-blades RFQ form (src/pages/contact.astro) and
 * persists the submission to the D1 database bound as `context.env.DB`.
 *
 * Field names mirror the `inputs[]`, `textarea` and `disclaimer` props passed
 * to the <Contact> widget — keep them in sync if the contact page changes.
 *
 * NOTE on types: this file declares minimal local stubs for the Cloudflare
 * Pages runtime types so `astro check` / `tsc` are happy without adding a
 * devDependency. At runtime Cloudflare provides the real `D1Database` and
 * `PagesFunction` bindings — these stubs are erased by the type checker and
 * never reach the worker. If `@cloudflare/workers-types` is ever added to
 * devDependencies, replace this block with:
 *
 *   import type { D1Database, PagesFunction } from '@cloudflare/workers-types';
 */

type D1Response = {
  success: boolean;
  meta?: unknown;
  results?: unknown[];
};

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Response>;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<T[]>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec?(query: string): Promise<D1Response>;
  batch?(statements: D1PreparedStatement[]): Promise<D1Response[]>;
}

interface EventContext<Env, P extends string, Data> {
  request: Request;
  env: Env;
  params: Record<P, string>;
  data: Data;
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  next(input?: Request | string): Promise<Response>;
  functionPath: string;
}

type PagesFunction<Env = unknown> = (
  context: EventContext<Env, string, Record<string, never>>,
) => Response | Promise<Response>;

interface Env {
  DB: D1Database;
}

// Tight caps protect against pathological payloads. The static page enforces
// the same domain limits via the contact form, but a bad actor can POST
// anything to the function URL.
const MAX_FIELD_LEN: Record<string, number> = {
  fullName: 200,
  company: 200,
  email: 254, // RFC 5321
  phone: 50,
  productType: 200,
  quantity: 100,
  materialSpec: 500,
  requirements: 5000,
  disclaimer: 12, // "on" or empty; trimmed form is short
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = ['fullName', 'company', 'email', 'productType', 'requirements'] as const;

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim().slice(0, 100);
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim().slice(0, 100);
  return '';
}

export const onRequestGet: PagesFunction<Env> = async () => {
  return Response.json({
    success: true,
    message: 'inquiry API is working',
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();

    const read = (name: string): string => {
      const raw = formData.get(name);
      return typeof raw === 'string' ? raw.trim() : '';
    };

    const fullName = truncate(read('fullName'), MAX_FIELD_LEN.fullName);
    const company = truncate(read('company'), MAX_FIELD_LEN.company);
    const email = truncate(read('email'), MAX_FIELD_LEN.email);
    const phone = truncate(read('phone'), MAX_FIELD_LEN.phone);
    const productType = truncate(read('productType'), MAX_FIELD_LEN.productType);
    const quantity = truncate(read('quantity'), MAX_FIELD_LEN.quantity);
    const materialSpec = truncate(read('materialSpec'), MAX_FIELD_LEN.materialSpec);
    const requirements = truncate(read('requirements'), MAX_FIELD_LEN.requirements);
    const disclaimerRaw = truncate(read('disclaimer'), MAX_FIELD_LEN.disclaimer);
    const disclaimer = disclaimerRaw === 'on' || disclaimerRaw === 'true' || disclaimerRaw === '1' ? 1 : 0;

    for (const field of REQUIRED_FIELDS) {
      if (!read(field)) {
        return Response.json(
          {
            success: false,
            message: 'Please complete the required fields.',
          },
          { status: 400 }
        );
      }
    }

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        {
          success: false,
          message: 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    const userAgent = (context.request.headers.get('user-agent') ?? '').slice(0, 500);
    const ip = getClientIp(context.request);

    // Bound parameters keep us safe from SQL injection even though the input
    // is sanitized above — D1 prepared statements are the primary defence.
    await context.env.DB.prepare(
      `INSERT INTO inquiries (
        full_name,
        company,
        email,
        phone,
        product_type,
        quantity,
        material_spec,
        requirements,
        disclaimer,
        user_agent,
        ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        fullName,
        company,
        email,
        phone || null,
        productType,
        quantity || null,
        materialSpec || null,
        requirements,
        disclaimer,
        userAgent || null,
        ip || null
      )
      .run();

    return Response.json({
      success: true,
      message: 'Inquiry submitted successfully.',
    });
  } catch (error) {
    // Log internally for Cloudflare observability; never leak SQL or stack.
    console.error('Inquiry submission error:', error);

    return Response.json(
      {
        success: false,
        message: 'Submission failed. Please try again later.',
      },
      { status: 500 }
    );
  }
};
