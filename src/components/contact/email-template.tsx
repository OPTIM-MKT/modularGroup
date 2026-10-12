import * as React from "react";
import type { ContactFormData } from "./contact.schema";

interface EmailTemplateProps {
  data: ContactFormData;
  interestLabel?: string;
}

const BRAND = {
  primary: "#006da6",
  primaryDark: "#004d77",
  primaryLight: "#2f9bd4",
  accentSoft: "#eef6fb",
  ink: "#0f172a",
  inkMuted: "#334155",
  surface: "#ffffff",
  surface2: "#f8fafc",
  border: "#e2e8f0",
  borderLight: "#edf2f7",
  muted: "#64748b",
} as const;

const s = {
  wrapper: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#eef2f6",
    padding: "36px 16px",
    margin: 0,
    WebkitTextSizeAdjust: "100%",
  } as React.CSSProperties,

  card: {
    maxWidth: 620,
    margin: "0 auto",
    backgroundColor: BRAND.surface,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 25px -5px rgba(0, 109, 166, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${BRAND.border}`,
  } as React.CSSProperties,

  header: {
    background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
    padding: "36px 36px 32px",
    color: "#ffffff",
    textAlign: "left" as const,
  } as React.CSSProperties,

  logoBadge: {
    display: "inline-block",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: 6,
    padding: "4px 12px",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    marginBottom: 14,
  } as React.CSSProperties,

  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
    lineHeight: 1.25,
  } as React.CSSProperties,

  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 14,
    margin: "8px 0 0",
    lineHeight: 1.5,
  } as React.CSSProperties,

  body: {
    padding: "32px 36px",
  } as React.CSSProperties,

  greeting: {
    fontSize: 15,
    color: BRAND.inkMuted,
    marginTop: 0,
    marginBottom: 24,
    lineHeight: 1.6,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: BRAND.primary,
    margin: "0 0 14px",
  } as React.CSSProperties,

  tableGrid: {
    width: "100%",
    borderCollapse: "separate" as const,
    borderSpacing: "0 10px",
    marginBottom: 16,
  } as React.CSSProperties,

  fieldCell: {
    backgroundColor: BRAND.surface2,
    borderRadius: 10,
    padding: "12px 16px",
    border: `1px solid ${BRAND.border}`,
  } as React.CSSProperties,

  fieldLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: BRAND.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 4,
  } as React.CSSProperties,

  fieldValue: {
    fontSize: 14,
    color: BRAND.ink,
    fontWeight: 500,
    margin: 0,
    wordBreak: "break-word" as const,
  } as React.CSSProperties,

  badge: {
    display: "inline-block",
    backgroundColor: BRAND.accentSoft,
    color: BRAND.primary,
    border: `1px solid ${BRAND.primary}40`,
    borderRadius: 16,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  divider: {
    border: "none",
    borderTop: `1px solid ${BRAND.border}`,
    margin: "24px 0",
  } as React.CSSProperties,

  messageBox: {
    backgroundColor: BRAND.accentSoft,
    borderLeft: `4px solid ${BRAND.primary}`,
    borderRadius: "0 10px 10px 0",
    padding: "18px 20px",
    marginBottom: 26,
  } as React.CSSProperties,

  messageText: {
    fontSize: 14,
    color: BRAND.ink,
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-line" as const,
  } as React.CSSProperties,

  ctaWrapper: {
    textAlign: "center" as const,
    marginTop: 24,
    marginBottom: 8,
  } as React.CSSProperties,

  ctaButton: {
    display: "inline-block",
    backgroundColor: BRAND.primary,
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 28px",
    borderRadius: 9999,
    textDecoration: "none",
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  footer: {
    borderTop: `1px solid ${BRAND.border}`,
    padding: "24px 36px",
    backgroundColor: BRAND.surface2,
    textAlign: "center" as const,
  } as React.CSSProperties,

  footerText: {
    fontSize: 12,
    color: BRAND.muted,
    margin: 0,
    lineHeight: 1.6,
  } as React.CSSProperties,
};

function FieldBox({
  label,
  value,
  badge = false,
  href,
}: {
  label: string;
  value: string;
  badge?: boolean;
  href?: string;
}) {
  return (
    <div style={s.fieldCell}>
      <span style={s.fieldLabel}>{label}</span>
      {badge ? (
        <span style={s.badge}>{value}</span>
      ) : href ? (
        <a
          href={href}
          style={{
            ...s.fieldValue,
            color: BRAND.primary,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {value}
        </a>
      ) : (
        <p style={s.fieldValue}>{value}</p>
      )}
    </div>
  );
}

export function EmailTemplate({
  data,
  interestLabel,
}: EmailTemplateProps) {
  const displayInterest = interestLabel || data.interest;
  const phoneText = data.phone?.trim() ? data.phone.trim() : "—";
  const companyText = data.company?.trim() ? data.company.trim() : "—";
  const localeText = (data.locale ?? "en").toUpperCase();

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoBadge}>Shower Walls · Modular Group</div>
          <h1 style={s.headerTitle}>Nueva Solicitud de Contacto</h1>
          <p style={s.headerSubtitle}>
            Recibida desde el sitio web de <strong>Shower Walls</strong>
          </p>
        </div>

        {/* Body */}
        <div style={s.body}>
          <p style={s.greeting}>
            Hola equipo, se ha recibido una nueva solicitud de{" "}
            <strong>{data.name}</strong> para{" "}
            <strong>{displayInterest}</strong>.
          </p>

          <p style={s.sectionTitle}>Detalles del remitente</p>

          {/* Grid rows implemented with tables for maximum email client compatibility */}
          <table style={s.tableGrid}>
            <tbody>
              <tr>
                <td style={{ width: "50%", paddingRight: 6, verticalAlign: "top" }}>
                  <FieldBox label="Nombre completo" value={data.name} />
                </td>
                <td style={{ width: "50%", paddingLeft: 6, verticalAlign: "top" }}>
                  <FieldBox label="Asunto / Empresa" value={displayInterest} badge />
                </td>
              </tr>
              <tr>
                <td style={{ width: "50%", paddingRight: 6, verticalAlign: "top" }}>
                  <FieldBox
                    label="Correo electrónico"
                    value={data.email}
                    href={`mailto:${data.email}`}
                  />
                </td>
                <td style={{ width: "50%", paddingLeft: 6, verticalAlign: "top" }}>
                  <FieldBox
                    label="Teléfono"
                    value={phoneText}
                    href={data.phone?.trim() ? `tel:${data.phone.trim()}` : undefined}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "50%", paddingRight: 6, verticalAlign: "top" }}>
                  <FieldBox label="Empresa / Proyecto" value={companyText} />
                </td>
                <td style={{ width: "50%", paddingLeft: 6, verticalAlign: "top" }}>
                  <FieldBox label="Idioma / Idioma del sitio" value={localeText} />
                </td>
              </tr>
            </tbody>
          </table>

          <hr style={s.divider} />

          <p style={s.sectionTitle}>Mensaje del cliente</p>
          <div style={s.messageBox}>
            <p style={s.messageText}>{data.message}</p>
          </div>

          {/* Quick Action Button */}
          <div style={s.ctaWrapper}>
            <a
              href={`mailto:${data.email}?subject=Re:%20Shower%20Walls%20-%20Consulta%20de%20${encodeURIComponent(data.name)}`}
              style={s.ctaButton}
            >
              Responder a {data.name} &rarr;
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <p style={s.footerText}>
            Este mensaje fue enviado a <strong>sistemas@shower-walls.net</strong> a través del formulario de
            contacto en el sitio web de <strong>Shower Walls</strong>.
          </p>
          <p style={{ ...s.footerText, marginTop: 6 }}>
            Puedes hacer clic en <em>Responder</em> directamente para escribir a{" "}
            <strong>{data.email}</strong>.
          </p>
          <p style={{ ...s.footerText, marginTop: 12, fontSize: 11 }}>
            © {new Date().getFullYear()} Shower Walls · Monterrey, Nuevo León, México
          </p>
        </div>
      </div>
    </div>
  );
}
