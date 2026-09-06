import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Products',
      links: [
        { text: 'Circular Blades', href: getPermalink('/products/category/circular') },
        { text: 'Straight Blades', href: getPermalink('/products/category/straight') },
        { text: 'Serrated Blades', href: getPermalink('/products/category/serrated') },
        { text: 'Shear Blades', href: getPermalink('/products/category/shear') },
        { text: 'Granulator Blades', href: getPermalink('/products/category/granulator') },
        { text: 'Custom Blades', href: getPermalink('/products/category/custom') },
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
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Request a Quote', href: getPermalink('/contact'), icon: 'tabler:mail' }],
};

export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'Circular Blades', href: getPermalink('/products/category/circular') },
        { text: 'Straight Blades', href: getPermalink('/products/category/straight') },
        { text: 'Serrated Blades', href: getPermalink('/products/category/serrated') },
        { text: 'Shear Blades', href: getPermalink('/products/category/shear') },
        { text: 'Granulator Blades', href: getPermalink('/products/category/granulator') },
        { text: 'Custom Blades', href: getPermalink('/products/category/custom') },
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
    KAIPU Industrial Blades · Manufacturer of precision machine knives for industrial converting, packaging and processing lines.
  `,
};
