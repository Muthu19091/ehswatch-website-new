// ─── Shared primitives ────────────────────────────────────────────────────────

export interface CmsImage {
  id: number;
  url: string;
  alt: string;
}


export interface CmsMedia {
  id: number;
  type: string;
  attributes: {
    url: string;
    alt: string | null;
    name: string;
    file_name: string;
  };
}
export interface CmsLink {
  label: string;
  type: "internal" | "external" | "anchor" | "email" | "phone" | "video_popup";
  url: string | null;
  page_id: string | null;
  anchor: string | null;
  video_url: string | null;
  video_file: { url: string } | null;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface CmsSettings {
  appearance: { primary_color: string };
  brand: {
    favicon: CmsImage | null;
    footer_logo: CmsImage | null;
    header_logo: CmsImage | null;
    name: string;
  };
  tracking: { ga4_id: string | null; gtm_id: string | null };
  seo: {
    default_og_image: CmsImage | null;
    organization_schema: string;
    website_schema: string;
    additional_schema: string;
  };
  structured_data: object[];
}

// ─── Header ───────────────────────────────────────────────────────────────────

export interface CmsNavItem {
  label: string;
  type: CmsLink["type"];
  page_id: string | null;
  url: string | null;
  anchor: string | null;
  children?: CmsNavItem[];
}

export interface CmsHeader {
  logo: CmsImage | null;
  logo_dark: CmsImage | null;
  logo_alt: string;
  logo_url: string;
  main_nav: CmsNavItem[];
  ctas: CmsLink[];
  behaviour: { sticky: boolean; transparent_on_hero: boolean; shrink_on_scroll: boolean };
  utility_bar: { enabled: boolean; items: CmsNavItem[]; background_color: string; text_color: string };
  search: { enabled: boolean };
  locales: { enabled: boolean; options: string[] };
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface CmsFooter {
  brand: { logo: { url: string }; tagline: string; address: string; phone: string; email: string };
  columns: Array<{ title: string; links: CmsLink[] }>;
  social_links: Array<{ platform: string; url: string }>;
  newsletter: { enabled: boolean; heading: string; placeholder: string; form_slug: string };
  cta: { enabled: boolean; heading: string; primary_cta: CmsLink };
  bottom: { copyright: string; links: CmsLink[] };
  layout: { columns_count: number; background: string };
}

// ─── Page & Blocks ────────────────────────────────────────────────────────────

export interface CmsBlock {
  type: string;
  data: Record<string, unknown>;
}

export interface CmsPageMeta {
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_image: CmsImage | null;
  robots: string;
}

export interface CmsPage {
  id: number;
  type: "page";
  attributes: {
    title: string;
    slug: string;
    type: string;
    status: string;
    published_at: string;
    content: CmsBlock[];
    meta: CmsPageMeta;
    tracking: { head_script: string | null; body_script: string | null };
    structured_data: object[];
    updated_at: string;
  };
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface CmsBlogPost {
  id: number;
  type: "blog-post";
  attributes: {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string;
    extra_sections: CmsBlock[];
    status: string;
    published_at: string;
    read_time_minutes: number;
    author: { name: string; email: string } | null;
    cover: CmsImage | null;
    meta: CmsPageMeta;
    structured_data: object[];
    updated_at: string;
  };
}

// ─── Case Study ───────────────────────────────────────────────────────────────

export interface CmsCaseStudy {
  id: number;
  type: "case-study";
  attributes: {
    title: string;
    slug: string;
    client_name: string;
    industry: string;
    summary: string;
    body: string;
    results: Array<{ label?: string; value?: string; metric?: string; before?: string; after?: string }>;
    status: string;
    published_at: string;
    cover: CmsImage | null;
    meta: CmsPageMeta;
    structured_data: object[];
    updated_at: string;
  };
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface CmsTestimonial {
  id: number;
  type: "testimonial";
  attributes: {
    author_name: string;
    author_role: string;
    author_company: string;
    quote: string;
    rating: number;
    is_featured: boolean;
    avatar: CmsImage | null;
  };
}

// ─── Client Logos ─────────────────────────────────────────────────────────────

export interface CmsClientLogo {
  id: number;
  type: "client-logo";
  attributes: {
    name: string;
    url: string;
    industry: string;
    logo: CmsMedia;
  };
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface CmsFormField {
  key: string;
  label: string;
  field_type: string;
  placeholder: string | null;
  help_text: string | null;
  options: string[] | null;
  default_value: string | null;
  required: boolean;
  full_width: boolean;
  catalogue_slug: string | null;
}

export interface CmsFormStep {
  key: string;
  title: string;
  description: string;
  fields: CmsFormField[];
}

export interface CmsForm {
  id: number;
  type: "form";
  attributes: {
    slug: string;
    name: string;
    form_type: string;
    description?: string | null;
    use_multi_step: boolean;
    submit_label: string;
    success_heading: string;
    success_message: string;
    redirect_url: string | null;
    captcha: { provider: string; site_key: string };
    fields?: CmsFormField[];
    steps?: CmsFormStep[];
    picker_catalogues?: Record<string, Array<{
      slug: string; name: string; icon: string; category?: string;
      base_price: string; description: string;
    }>>;
  };
}

// ─── Product Modules ──────────────────────────────────────────────────────────

export interface CmsProductModule {
  id: number;
  type: "product-module";
  attributes: {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    icon_image: CmsImage | null;
    features: Array<{ icon: string; title: string; description: string }>;
    content: CmsBlock[];
    status: string;
    published_at: string | null;
    meta: CmsPageMeta;
    tracking: { head_script: string | null; body_script: string | null };
    structured_data: object[];
    updated_at: string;
  };
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface SingletonResponse<T> {
  data: T;
  meta: { request_id: string };
}

export interface CollectionResponse<T> {
  data: T[];
  meta: { request_id: string };
}

// ─── Form submission ──────────────────────────────────────────────────────────

export interface FormSubmitResult {
  ok: boolean;
  data?: { id: number; message: string; redirect_url: string | null };
  errors?: Array<{ status: number; code: string; title: string; detail: string; source: { pointer: string } }>;
}
