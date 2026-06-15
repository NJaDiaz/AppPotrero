
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface BackToLandingProps {
  variant?: 'banner' | 'button'
}

export default function BackToLanding({ variant = 'button' }: BackToLandingProps) {
  if (variant === 'banner') {
    return (
      <Link href="/landing">
        <div className="bg-brand-500 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-ccta.jpeg" alt="CCTA" width={24} height={24} className="rounded-md object-contain" />
            <span className="text-xs font-bold">Cámara de Comercio, Turismo y Afines · Potrero de los Funes</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
        </div>
      </Link>
    )
  }

  return (
    <Link href="/landing"
      className="inline-flex items-center gap-1.5 text-brand-500 font-bold text-xs hover:text-brand-600 transition-colors">
      <Image src="/logo-ccta.jpeg" alt="CCTA" width={18} height={18} className="rounded object-contain" />
      Sitio CCTA
      <ExternalLink className="w-3 h-3" />
    </Link>
  )
}
