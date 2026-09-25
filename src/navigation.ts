import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { buildCategoryHref } from './utils/products';
import { TOPICS, topicHrefFor, topicsIndexHref } from './data/topics';

export const headerData = {
  links: [
    {
      text: 'Products',
      href: getPermalink('/products'),
      links: [
        { text: 'Circular Blades', href: buildCategoryHref('circular') },
        { text: 'Straight Blades', href: buildCategoryHref('straight') },
        { text: 'Serrated Blades', href: buildCategoryHref('serrated') },
        { text: 'Shear Blades', href: buildCategoryHref('shear') },
        { text: 'Granulator Blades', href: buildCategoryHref('granulator') },
        { text: 'Custom Blades', href: buildCategoryHref('custom') },
      ],
    },
    {
      text: 'Solutions',
      href: getPermalink('/solutions'),
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
    },
    {
      text: 'Industries',
      href: getPermalink('/industries'),
      links: [
        { text: 'Printing & Packaging', href: getPermalink('/industries/printing-packaging') },
        { text: 'Paper & Tissue', href: getPermalink('/industries/paper-tissue') },
        { text: 'Food Processing', href: getPermalink('/industries/food-processing') },
        { text: 'Plastics Recycling', href: getPermalink('/industries/plastics-recycling') },
        { text: 'Converting', href: getPermalink('/industries/converting') },
        { text: 'Metalworking', href: getPermalink('/industries/metalworking') },
      ],
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
      // 9-topic dropdown menu wired to the centralized topic registry.
      // The first link is a high-level "All posts" entry; the second is the
      // sitemap-style /blog/topics/ index; the rest go straight to the
      // individual topic category pages.
      links: [
        { text: 'All Posts', href: getBlogPermalink() },
        { text: 'Browse All Topics', href: topicsIndexHref() },
        ...TOPICS.map((t) => ({ text: t.title, href: topicHrefFor(t) })),
      ],
    },
  ],
  actions: [{ text: 'Request a Quote', href: getPermalink('/contact'), icon: 'tabler:mail' }],
};

export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'Circular Blades', href: buildCategoryHref('circular') },
        { text: 'Straight Blades', href: buildCategoryHref('straight') },
        { text: 'Serrated Blades', href: buildCategoryHref('serrated') },
        { text: 'Shear Blades', href: buildCategoryHref('shear') },
        { text: 'Granulator Blades', href: buildCategoryHref('granulator') },
        { text: 'Custom Blades', href: buildCategoryHref('custom') },
      ],
    },
    {
      title: 'Industries',
      links: [
        { text: 'Printing & Packaging', href: getPermalink('/solutions#printing-packaging') },
        { text: 'Paper & Tissue', href: getPermalink('/solutions#paper-tissue') },
        { text: 'Food Processing', href: getPermalink('/solutions#food-processing') },
        { text: 'Plastics Recycling', href: getPermalink('/solutions#plastics-recycling') },
        { text: 'Converting', href: getPermalink('/solutions#converting') },
        { text: 'Metalworking', href: getPermalink('/solutions#metalworking') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Solutions', href: getPermalink('/solutions') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Technical Specs', href: getPermalink('/products') },
        { text: 'Quality & Certifications', href: getPermalink('/quality') },
        { text: 'Request a Quote', href: getPermalink('/contact') },
        { text: 'Material Guide', href: getPermalink('/solutions#materials') },
        { text: 'Maintenance Guide', href: getPermalink('/services#maintenance') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Industrial Knives · Manufacturer of precision machine knives for industrial converting, packaging and processing lines.
  `,
};
