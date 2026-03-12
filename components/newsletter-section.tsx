"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="px-6 lg:px-12">
        <div
          className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-8">
            Be the first to discover the latest news, collections, and exclusive launches
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                required
                className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-[12px] tracking-[0.1em] placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2 group"
            >
              {isSubmitted ? "Subscribed!" : "Confirm"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-6 text-[10px] text-text-tertiary leading-relaxed">
            By confirming my subscription, I agree to receive the newsletter.
            <br />
            For more information, read the{" "}
            <button type="button" className="underline hover:text-primary transition-colors">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
