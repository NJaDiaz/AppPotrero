import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface BackToLandingProps {
  variant?: 'banner' | 'button'
}

export default function BackToLanding({
  variant = 'button',
}: BackToLandingProps) {
  if (variant === 'banner') {
    return (
      <Link
        href="/landing"
        className="block transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative mx-auto flex max-w-lg items-center justify-between px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">

                <Image
                  src="/logo-ccta.jpeg"
                  alt="CCTA"
                  width={34}
                  height={34}
                  className="rounded-xl object-contain"
                />

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Cámara de Comercio
                </p>

                <h3 className="font-display text-lg font-black text-white">
                  Potrero de los Funes
                </h3>

              </div>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">

              <ExternalLink className="h-5 w-5 text-white" />

            </div>

          </div>

        </div>
      </Link>
    )
  }

  return (
    <Link
      href="/landing"
      className="group inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      <div className="overflow-hidden rounded-xl">

        <Image
          src="/logo-ccta.jpeg"
          alt="CCTA"
          width={34}
          height={34}
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />

      </div>

      <div className="leading-tight">

        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Sitio oficial
        </p>

        <p className="font-semibold text-gray-800">
          Cámara de Comercio
        </p>

      </div>

      <ExternalLink className="ml-1 h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-brand-500" />
    </Link>
  )
}