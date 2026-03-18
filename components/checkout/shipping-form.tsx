"use client"

import type { UseFormReturn } from "react-hook-form"
import type { CheckoutFormData } from "@/app/checkout/checkout-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "CH", name: "Switzerland" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "ES", name: "Spain" },
]

interface ShippingFormProps {
  form: UseFormReturn<CheckoutFormData>
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2">
      {children}
      {required && <span className="text-primary ml-0.5">*</span>}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[11px] text-destructive mt-1.5">{message}</p>
}

function TextInput({
  form,
  name,
  placeholder,
  required,
  label,
  autoComplete,
}: {
  form: UseFormReturn<CheckoutFormData>
  name: keyof CheckoutFormData
  placeholder: string
  required?: boolean
  label: string
  autoComplete?: string
}) {
  const { register, formState: { errors } } = form
  const error = errors[name]

  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        {...register(name)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full h-12 px-4 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 hover:border-white/20 focus:border-primary focus:outline-none transition-colors duration-300"
      />
      <FieldError message={error?.message as string} />
    </div>
  )
}

export function ShippingForm({ form }: ShippingFormProps) {
  const { setValue, formState: { errors }, watch } = form
  const country = watch("country")

  return (
    <section>
      <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em] mb-6">
        Shipping Address
      </h2>

      <div className="space-y-4">
        <TextInput
          form={form}
          name="fullName"
          label="Full Name"
          placeholder="First and Last Name"
          required
          autoComplete="name"
        />

        <TextInput
          form={form}
          name="line1"
          label="Address"
          placeholder="Street address"
          required
          autoComplete="address-line1"
        />

        <TextInput
          form={form}
          name="line2"
          label="Apartment / Suite"
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            form={form}
            name="city"
            label="City"
            placeholder="City"
            required
            autoComplete="address-level2"
          />
          <TextInput
            form={form}
            name="state"
            label="State / Province"
            placeholder="State or province"
            autoComplete="address-level1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            form={form}
            name="postalCode"
            label="Postal Code"
            placeholder="Postal / ZIP code"
            required
            autoComplete="postal-code"
          />

          <div>
            <FieldLabel required>Country</FieldLabel>
            <Select
              value={country || ""}
              onValueChange={(value) => setValue("country", value, { shouldValidate: true })}
            >
              <SelectTrigger className="h-12 bg-transparent border-border text-[13px] text-foreground rounded-none hover:border-white/20 focus:ring-0 focus:border-primary transition-colors duration-300">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-3)] border-border rounded-none">
                {COUNTRIES.map((c) => (
                  <SelectItem
                    key={c.code}
                    value={c.code}
                    className="text-[13px] text-foreground focus:bg-[var(--surface-4)] focus:text-foreground rounded-none"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.country?.message} />
          </div>
        </div>

        <TextInput
          form={form}
          name="phone"
          label="Phone (Optional)"
          placeholder="For delivery updates"
          autoComplete="tel"
        />
      </div>
    </section>
  )
}
