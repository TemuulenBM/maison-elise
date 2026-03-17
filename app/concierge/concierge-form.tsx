"use client"

import { useState } from "react"

type FormState = {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

const SERVICES = [
  "Personal styling consultation",
  "Bespoke / custom order",
  "Gift curation",
  "Monogramming & personalization",
  "Repair & restoration",
  "General inquiry",
]

export function ConciergeForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const field = (name: keyof FormState) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [name]: e.target.value })),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus("sent")
      setForm({ name: "", email: "", phone: "", service: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-border p-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-4">
          Message Received
        </p>
        <h2 className="font-serif text-3xl text-foreground font-light tracking-[0.04em] mb-4">
          Thank You
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Our concierge team will be in touch within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Name *
          </label>
          <input
            {...field("name")}
            required
            className="w-full bg-surface-2 border border-border px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Email *
          </label>
          <input
            {...field("email")}
            type="email"
            required
            className="w-full bg-surface-2 border border-border px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Phone
          </label>
          <input
            {...field("phone")}
            type="tel"
            className="w-full bg-surface-2 border border-border px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Service
          </label>
          <select
            {...field("service")}
            className="w-full bg-surface-2 border border-border px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
          >
            <option value="">Select a service...</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Message *
        </label>
        <textarea
          {...field("message")}
          required
          rows={6}
          placeholder="Tell us how we can assist you..."
          className="w-full bg-surface-2 border border-border px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-[12px] text-destructive">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-10 py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}
