/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Resend API key used by `src/pages/api/contact.ts`. */
  readonly RESEND_API_KEY?: string;
  /** Recipient of contact-form enquiries. Comma-separated for several. */
  readonly CONTACT_TO_EMAIL?: string;
  /** Verified sender, e.g. `Modular Group <website@modulargroup.com>`. */
  readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
