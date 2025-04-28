import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import WhatsAppButton from '@/components/whatsapp-button';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ivan Infante | Web Developer for Businesses in the Philippines',
  description: 'Modern, affordable websites with complete setup of hosting, domain, and landing page. Fast 48-hour delivery for businesses.',
  keywords: 'web developer, business websites, affordable web design, local business websites, website development',
  authors: [{ name: 'Ivan Infante' }],
  creator: 'Ivan Infante',
  publisher: 'Ivan Infante',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  // metadataBase is removed for static export compatibility
  openGraph: {
    title: 'Modern Websites for Businesses | Ivan Infante',
    description: 'Professional websites with fast delivery and complete setup. Serving businesses in the Philippines.',
    siteName: 'Ivan Infante Web Development',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: '/images/ivan-cutout.png',
        width: 800,
        height: 600,
        alt: 'Ivan Infante - Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Websites for Businesses | Ivan Infante',
    description: 'Professional websites with fast delivery and complete setup. Serving businesses in the Philippines.',
    images: ['/images/ivan-cutout.png'],
    creator: '@ivaninfante',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with your actual verification code when you have one
  },
  category: 'web development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Ivan Infante Web Development",
              "description": "Modern websites with fast delivery and complete setup for businesses.",
              "telephone": "+639123456789",
              "email": "contact@yourwebsite.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Web Developer Street",
                "addressLocality": "Manila",
                "addressRegion": "Metro Manila",
                "postalCode": "1000",
                "addressCountry": "PH"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 14.5995,
                "longitude": 120.9842
              },
              "priceRange": "₱₱",
              "openingHours": "Mo-Fr 09:00-18:00",
              "image": "/images/ivan-cutout.png",
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 14.5995,
                  "longitude": 120.9842
                },
                "geoRadius": "50km"
              },
              "makesOffer": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Website Development",
                    "description": "Full-featured, responsive websites with essential pages and SEO optimization."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Landing Page Development",
                    "description": "High-converting single page designed to showcase products or services and drive action."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom Dashboard Development",
                    "description": "User-friendly dashboard interfaces for internal tools, analytics, and business management."
                  }
                }
              ]
            }`
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <WhatsAppButton phoneNumber="+639123456789" message="Hello! I'm interested in having you build a website for my business." />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}