import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiLoader } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import { useReactI18n } from "@/i18n/useReacti18n";

type InterestKey =
  | "group"
  | "showerWalls"
  | "modulWoods"
  | "kuartzSurfaces"
  | "modularVanityTops";

const INTERESTS: InterestKey[] = [
  "group",
  "showerWalls",
  "modulWoods",
  "kuartzSurfaces",
  "modularVanityTops",
];

interface Props {
  lang?: string;
  /** Preselects the company a page belongs to. */
  defaultInterest?: InterestKey;
}

export default function ContactForm({ lang, defaultInterest = "group" }: Props) {
  const { t, lang: locale } = useReactI18n(lang);
  const copy = t.contact.form;
  const [sent, setSent] = useState(false);

  // Rebuilt per locale so validation messages are translated, not just labels.
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, copy.errors.nameMin).max(120, copy.errors.tooLong),
        email: z.email(copy.errors.emailInvalid).trim().max(160, copy.errors.tooLong),
        phone: z.string().trim().max(40, copy.errors.tooLong).optional().or(z.literal("")),
        company: z.string().trim().max(140, copy.errors.tooLong).optional().or(z.literal("")),
        interest: z.enum(
          INTERESTS as [InterestKey, ...InterestKey[]],
          copy.errors.interestRequired,
        ),
        message: z
          .string()
          .trim()
          .min(10, copy.errors.messageMin)
          .max(4000, copy.errors.tooLong),
        // Honeypot: a real person never fills a field they cannot see.
        website: z.string().max(0).optional().or(z.literal("")),
      }),
    [copy],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      interest: defaultInterest,
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      toast.success(copy.successTitle, { description: copy.successBody });
      setSent(true);
      reset();
    } catch {
      toast.error(copy.errorTitle, { description: copy.errorBody });
    }
  };

  const field =
    "w-full rounded-2xl border border-line bg-canvas px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/60 transition-colors duration-200 focus:border-accent focus-visible:outline-none";

  return (
    <>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: "inherit" } }}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="name"
            label={copy.name.label}
            required
            error={errors.name?.message}
          >
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={copy.name.placeholder}
              className={field}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field
            id="email"
            label={copy.email.label}
            required
            error={errors.email?.message}
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={copy.email.placeholder}
              className={field}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field
            id="phone"
            label={copy.phone.label}
            hint={copy.phone.optional}
            error={errors.phone?.message}
          >
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder={copy.phone.placeholder}
              className={field}
              {...register("phone")}
            />
          </Field>

          <Field
            id="company"
            label={copy.company.label}
            hint={copy.company.optional}
            error={errors.company?.message}
          >
            <input
              id="company"
              type="text"
              autoComplete="organization"
              placeholder={copy.company.placeholder}
              className={field}
              {...register("company")}
            />
          </Field>
        </div>

        <Field
          id="interest"
          label={copy.interest.label}
          required
          error={errors.interest?.message}
        >
          <select
            id="interest"
            className={`${field} appearance-none`}
            aria-invalid={Boolean(errors.interest)}
            {...register("interest")}
          >
            {INTERESTS.map((key) => (
              <option key={key} value={key}>
                {copy.interest.options[key]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="message"
          label={copy.message.label}
          required
          error={errors.message?.message}
        >
          <textarea
            id="message"
            rows={6}
            placeholder={copy.message.placeholder}
            className={`${field} resize-y`}
            aria-invalid={Boolean(errors.message)}
            {...register("message")}
          />
        </Field>

        {/* Off-screen rather than display:none, so bots that skip hidden inputs
            still fill it. Never focusable, never announced. */}
        <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary group px-6 py-3"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.sending}
              </>
            ) : (
              <>
                {copy.submit}
                <FiArrowRight
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </button>

          <p className="text-xs text-muted" role="status" aria-live="polite">
            {sent ? copy.successBody : copy.description}
          </p>
        </div>
      </form>
    </>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

/** Inline validation, announced as it happens rather than only on submit. */
function Field({ id, label, hint, required, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-ink"
      >
        <span>
          {label}
          {required && (
            <span className="text-accent" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </span>
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
