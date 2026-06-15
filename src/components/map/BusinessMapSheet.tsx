'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, MessageCircle, Navigation, Bookmark, CheckCircle } from 'lucide-react'
import { cn, getWhatsAppUrl, getDirectionsUrl, isBusinessOpen } from '@/lib/utils'
import { CATEGORY_MAP } from '@/types'
import type { Business } from '@/types'

interface Props {
  business: Business | null
  onClose: () => void
}

export default function BusinessMapSheet({ business, onClose }: Props) {
  if (!business) return null

  const category = CATEGORY_MAP[business.category]
  const hasSchedule = !!business.schedule
  const isOpen = isBusinessOpen(business.schedule)

  const handleWhatsApp = () => {
    if (business.whatsapp) {
      window.open(getWhatsAppUrl(business.whatsapp, `Hola! Te contacto desde la app de la CCTA Potrero de los Funes`), '_blank')
    }
  }

  const handleCall = () => business.phone && window.open(`tel:${business.phone}`, '_self')

  const handleDirections = () => {
    window.open(getDirectionsUrl(business.latitude, business.longitude, business.name), '_blank')
  }

  return (
    <div>
      <div className="flex justify-center pt-2 pb-1 drag-handle">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="px-4 pb-4">
        <div className="flex gap-3 mb-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
            {business.cover_url ? (
              <Image src={business.cover_url} alt={business.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: category?.bgColor }}>
                {category?.icon}
              </div>
            )}
            {business.is_featured && (
              <div className="absolute bottom-1 left-1 bg-brand-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">★ TOP</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display font-bold text-gray-900 text-base leading-tight">{business.name}</h2>
              {business.is_verified && <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />}
            </div>
            <span className="text-xs font-semibold" style={{ color: category?.color }}>{category?.label}</span>
            {hasSchedule && (
              <div className="mt-1">
                <span className={cn('text-xs font-semibold flex items-center gap-1', isOpen ? 'text-emerald-600' : 'text-red-500')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  {isOpen ? 'Abierto ahora' : 'Cerrado'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <button onClick={handleDirections}
            className="flex flex-col items-center gap-1 py-3 bg-brand-50 rounded-xl text-brand-600">
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Cómo llegar</span>
          </button>
          {business.whatsapp && (
            <button onClick={handleWhatsApp}
              className="flex flex-col items-center gap-1 py-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-semibold">WhatsApp</span>
            </button>
          )}
          {business.phone && (
            <button onClick={handleCall}
              className="flex flex-col items-center gap-1 py-3 bg-blue-50 rounded-xl text-blue-600">
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Llamar</span>
            </button>
          )}
          <Link href={`/comercio/${business.slug}`}
            className="flex flex-col items-center gap-1 py-3 bg-gray-50 rounded-xl text-gray-600">
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Ver más</span>
          </Link>
        </div>

        <Link href={`/comercio/${business.slug}`}
          className="block w-full text-center py-3 bg-brand-500 text-white font-bold rounded-2xl text-sm shadow-brand">
          Ver perfil completo →
        </Link>
      </div>
    </div>
  )
}
