import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maisonelise.com'),
  title: {
    default: 'MAISON ÉLISE | Luxury Handbags',
    template: '%s | MAISON ÉLISE',
  },
  description: 'Discover exceptional craftsmanship in our collection of luxury leather handbags. Timeless elegance, contemporary design.',
  openGraph: {
    type: 'website',
    siteName: 'MAISON ÉLISE',
    title: 'MAISON ÉLISE | Luxury Handbags',
    description: 'Discover exceptional craftsmanship in our collection of luxury leather handbags. Timeless elegance, contemporary design.',
    images: [{ url: 'https://qtvmfbicoibfdbhaksoz.supabase.co/storage/v1/object/public/products/hero-model.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAISON ÉLISE | Luxury Handbags',
    description: 'Discover exceptional craftsmanship in our collection of luxury leather handbags.',
    images: ['https://qtvmfbicoibfdbhaksoz.supabase.co/storage/v1/object/public/products/hero-model.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
