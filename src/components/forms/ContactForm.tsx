import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiLoader } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import { actions } from "astro:actions";

import { useReactI18n } from "@/i18n/useReacti18n";
import {
  INTERESTS,
  type InterestKey,
  buildContactSchema,
  type ContactFormData,
} from "@/components/contact/contact.schema";

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
      buildContactSchema({
        name: copy.errors.nameMin,
        email: copy.errors.emailInvalid,
        interest: copy.errors.interestRequired,
        message: copy.errors.messageMin,
        tooLong: copy.errors.tooLong,
      }),
    [copy],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
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

  const onSubmit = async (values: ContactFormData) => {
    try {
      const { error } = await actions.send({
        ...values,
        locale,
      });

      if (error) {
        toast.error(copy.errorTitle, {
          description: error.message || copy.errorBody,
        });
        return;
      }

      toast.success(copy.successTitle, {
        description: copy.successBody,
      });
      setSent(true);
      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        interest: defaultInterest,
        message: "",
        website: "",
      });
    } catch {
      toast.error(copy.errorTitle, {
        description: copy.errorBody,
      });
    }
  };

  const onInvalid = () => {
    toast.error(copy.errorTitle, {
      description: copy.errors.nameMin,
    });
  };

  const field =
    "w-full rounded-2xl border border-line bg-canvas px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/60 transition-colors duration-200 focus:border-accent focus-visible:outline-none";

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: "inherit" } }}
      />

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="grid gap-5">
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

        {/* Off-screen honeypot: a bot will fill it, while humans cannot see it */}
        <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary group px-6 py-3 cursor-pointer disabled:cursor-not-allowed"
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
