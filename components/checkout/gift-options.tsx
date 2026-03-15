"use client"

import { Gift } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { UseFormReturn } from "react-hook-form"
import type { CheckoutFormData } from "@/app/checkout/checkout-form"

interface GiftOptionsProps {
  form: UseFormReturn<CheckoutFormData>
}

export function GiftOptions({ form }: GiftOptionsProps) {
  const { register, watch, formState: { errors } } = form
  const giftPackaging = watch("giftPackaging")
  const giftNote = watch("giftNote") || ""

  return (
    <section>
      <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em] mb-6">
        Gift Options
      </h2>

      <label className="flex items-start gap-4 cursor-pointer group p-5 border border-border hover:border-primary/40 transition-colors duration-300">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            {...register("giftPackaging")}
            className="peer sr-only"
          />
          <div className="w-5 h-5 border border-border peer-checked:border-primary peer-checked:bg-primary transition-all duration-200 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-background opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-[12px] text-foreground uppercase tracking-[0.1em] font-medium">
              Gift Packaging
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
            Your piece will arrive in our signature Maison Elise gift box, finished with a hand-tied ribbon
          </p>
        </div>

        <span className="text-[12px] text-primary italic whitespace-nowrap">
          Complimentary
        </span>
      </label>

      <AnimatePresence>
        {giftPackaging && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2">
                Gift Note (Optional)
              </label>
              <textarea
                {...register("giftNote")}
                placeholder="Add a personal message..."
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 resize-none"
              />
              <div className="flex justify-between mt-1.5">
                {errors.giftNote && (
                  <p className="text-[11px] text-destructive">{errors.giftNote.message}</p>
                )}
                <p className="text-[10px] text-muted-foreground ml-auto">
                  {giftNote.length}/500
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
