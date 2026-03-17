"use client"

import { useState } from "react"
import Link from "next/link"
import type { Address } from "@/lib/generated/prisma"

type AddressFormData = {
  label: string
  fullName: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const EMPTY_FORM: AddressFormData = {
  label: "",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  isDefault: false,
}

function AddressCard({
  address,
  onEdit,
  onDelete,
}: {
  address: Address
  onEdit: (a: Address) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="border border-border p-6">
      {address.label && (
        <p className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">
          {address.label}
          {address.isDefault && " · Default"}
        </p>
      )}
      <div className="text-[13px] text-foreground leading-relaxed mb-4">
        <p>{address.fullName}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}
          {address.state && `, ${address.state}`} {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone && (
          <p className="text-muted-foreground mt-1">{address.phone}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onEdit(address)}
          className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function AddressForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial: AddressFormData
  onSave: (data: AddressFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<AddressFormData>(initial)

  const field = (name: keyof AddressFormData) => ({
    value: form[name] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [name]: e.target.value })),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(form)
      }}
      className="border border-border p-6 space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Label (optional)
          </label>
          <input
            {...field("label")}
            placeholder="Home, Office..."
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Full Name *
          </label>
          <input
            {...field("fullName")}
            required
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Address Line 1 *
        </label>
        <input
          {...field("line1")}
          required
          className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Address Line 2
        </label>
        <input
          {...field("line2")}
          className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            City *
          </label>
          <input
            {...field("city")}
            required
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            State / Province
          </label>
          <input
            {...field("state")}
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Postal Code *
          </label>
          <input
            {...field("postalCode")}
            required
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Country *
          </label>
          <input
            {...field("country")}
            required
            className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Phone
        </label>
        <input
          {...field("phone")}
          type="tel"
          className="w-full bg-surface-2 border border-border px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
          className="w-4 h-4 border border-border bg-surface-2 accent-primary"
        />
        <span className="text-[12px] text-foreground">Set as default address</span>
      </label>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export function AddressBook({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [editing, setEditing] = useState<Address | null>(null)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(data: AddressFormData) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to save address")
      const created: Address = await res.json()
      setAddresses((prev) => {
        const updated = data.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev
        return [created, ...updated]
      })
      setAdding(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(data: AddressFormData) {
    if (!editing) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/addresses/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update address")
      const updated: Address = await res.json()
      setAddresses((prev) => {
        const list = data.isDefault
          ? prev.map((a) => ({ ...a, isDefault: a.id === editing.id ? false : a.isDefault }))
          : prev
        return list.map((a) => (a.id === editing.id ? updated : a))
      })
      setEditing(null)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this address?")) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete address")
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-12 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/account" className="hover:text-primary transition-colors">
          Account
        </Link>
        <span>/</span>
        <span className="text-foreground">Addresses</span>
      </div>

      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            My Account
          </p>
          <h1 className="font-serif text-4xl text-foreground font-light tracking-[0.04em]">
            Address Book
          </h1>
        </div>
        {!adding && !editing && (
          <button
            onClick={() => setAdding(true)}
            className="px-6 py-2.5 border border-border text-[11px] uppercase tracking-[0.12em] text-foreground hover:border-primary hover:text-primary transition-colors duration-300"
          >
            + Add Address
          </button>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-destructive mb-6 border border-destructive/30 px-4 py-3">
          {error}
        </p>
      )}

      {adding && (
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
            New Address
          </p>
          <AddressForm
            initial={EMPTY_FORM}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
            loading={loading}
          />
        </div>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="border border-border p-12 text-center">
          <p className="text-[13px] text-muted-foreground mb-6">
            No saved addresses yet.
          </p>
          <button
            onClick={() => setAdding(true)}
            className="inline-block px-8 py-3 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) =>
            editing?.id === addr.id ? (
              <div key={addr.id}>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  Edit Address
                </p>
                <AddressForm
                  initial={{
                    label: addr.label ?? "",
                    fullName: addr.fullName,
                    line1: addr.line1,
                    line2: addr.line2 ?? "",
                    city: addr.city,
                    state: addr.state ?? "",
                    postalCode: addr.postalCode,
                    country: addr.country,
                    phone: addr.phone ?? "",
                    isDefault: addr.isDefault,
                  }}
                  onSave={handleEdit}
                  onCancel={() => setEditing(null)}
                  loading={loading}
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
