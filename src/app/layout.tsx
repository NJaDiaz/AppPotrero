import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CCTA – Cámara de Comercio, Turismo y Afines | Potrero de los Funes',
    template: '%s | CCTA Potrero',
  },
  description: 'Cámara de Comercio, Turismo y Afines de Potrero de los Funes, San Luis, Argentina. Comercios, turismo, servicios y lugares para visitar.',
  keywords: ['Potrero de los Funes', 'CCTA', 'cámara de comercio', 'turismo', 'San Luis', 'Argentina'],
  authors: [{ name: 'CCTA Potrero de los Funes' }],
  creator: 'CCTA Potrero de los Funes',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CCTA Potrero',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'CCTA Potrero de los Funes',
    title: 'CCTA – Cámara de Comercio, Turismo y Afines | Potrero de los Funes',
    description: 'Comercios, turismo, servicios y lugares para visitar en Potrero de los Funes.',
    images: ['/logo-ccta.jpeg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { fontFamily: 'Nunito, sans-serif', borderRadius: '12px' },
          }}
        />
      </body>
    </html>
  )
}
