'use client'
import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowLeft, Share2, MapPin, Clock, Phone, Globe,
  MessageCircle, Instagram, Navigation, Images, CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, getWhatsAppUrl, getDirectionsUrl, isBusinessOpen } from '@/lib/utils'
import { CATEGORY_MAP } from '@/types'
import type { Business, BusinessMedia } from '@/types'
import BottomNav from '@/components/shared/BottomNav'

interface Props {
  business: Business
  media: BusinessMedia[]
}

const DAY_LABELS: Record<string, string> = {
  monday:'Lunes', tuesday:'Martes', wednesday:'Miércoles',
  thursday:'Jueves', friday:'Viernes', saturday:'Sábado', sunday:'Domingo'
}
const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

export default function BusinessPageClient({ business, media }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'galeria'>('info')
  const router = useRouter()
  const category = CATEGORY_MAP[business.category]
  const hasSchedule = !!business.schedule
  const isOpen = isBusinessOpen(business.schedule)

  const handleWhatsApp = () => {
    if (business.whatsapp) {
      window.open(getWhatsAppUrl(business.whatsapp, `Hola ${business.name}! Te contacto desde la app de la CCTA Potrero de los Funes`), '_blank')
    }
  }

  const handleDirections = () => {
    window.open(getDirectionsUrl(business.latitude, business.longitude, business.name), '_blank')
  }

  console.log('schedule', business.schedule)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: business.name, text: business.short_description || business.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover image */}
      <div className="relative h-64 bg-gray-200">
        {business.cover_url ? (
          <Image src={business.cover_url} alt={business.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: category?.bgColor }}>
            {category?.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {media.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Images className="w-3.5 h-3.5" /> +{media.length} fotos
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {business.is_featured && (
          <div className="absolute bottom-4 left-4 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
            ☆ Destacado
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-start gap-3 max-w-lg mx-auto">
          {business.logo_url && (
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 -mt-8 bg-white">
              <Image src={business.logo_url} alt={business.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-gray-900 text-xl">{business.name}</h1>
              {business.is_verified && <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />}
            </div>
            <span className="text-sm font-semibold" style={{ color: category?.color }}>{category?.label}</span>
            {hasSchedule && (
              <div className="mt-1">
                <span className={cn('text-sm font-semibold flex items-center gap-1', isOpen ? 'text-emerald-600' : 'text-red-500')}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {isOpen ? 'Abierto ahora' : 'Cerrado'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 max-w-lg mx-auto overflow-x-auto scrollbar-hide">
          <button onClick={handleDirections}
            className="flex flex-col items-center gap-1.5 min-w-[72px] py-3 bg-brand-50 rounded-2xl text-brand-600">
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] font-bold">Cómo llegar</span>
          </button>
          {business.whatsapp && (
            <button onClick={handleWhatsApp}
              className="flex flex-col items-center gap-1.5 min-w-[72px] py-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </button>
          )}
          {business.phone && (
            <button onClick={() => window.open(`tel:${business.phone}`, '_self')}
              className="flex flex-col items-center gap-1.5 min-w-[72px] py-3 bg-blue-50 rounded-2xl text-blue-600">
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-bold">Llamar</span>
            </button>
          )}
          {business.instagram && (
            <button onClick={() => window.open(`https://instagram.com/${business.instagram}`, '_blank')}
              className="flex flex-col items-center gap-1.5 min-w-[72px] py-3 bg-pink-50 rounded-2xl text-pink-600">
              <Instagram className="w-5 h-5" />
              <span className="text-[10px] font-bold">Instagram</span>
            </button>
          )}
          {business.website && (
            <button onClick={() => window.open(business.website!, '_blank')}
              className="flex flex-col items-center gap-1.5 min-w-[72px] py-3 bg-gray-50 rounded-2xl text-gray-600">
              <Globe className="w-5 h-5" />
              <span className="text-[10px] font-bold">Web</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex max-w-lg mx-auto">
          {(['info', 'galeria'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('flex-1 py-3 text-sm font-bold capitalize transition-colors relative',
                activeTab === tab ? 'text-brand-500' : 'text-gray-400')}>
              {tab === 'galeria' ? `Galería${media.length ? ` (${media.length})` : ''}` : 'Información'}
              {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">

        {activeTab === 'info' && (
          <div className="space-y-4">
            {business.description && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{business.description}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-gray-900">Información de contacto</h3>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{business.address}, {business.city}</span>
              </div>
              {business.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{business.phone}</span>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(business.phone!)} className="text-brand-500 text-xs font-bold">Copiar</button>
                </div>
              )}
              {business.website && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-brand-500 truncate">{business.website}</span>
                  </div>
                  <a href={business.website} target="_blank" className="text-brand-500 text-xs font-bold flex-shrink-0">Visitar</a>
                </div>
              )}
            </div>

            {hasSchedule && (
              <div className="bg-white rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Horarios
                </h3>
                <div className="space-y-2">
                  {DAY_ORDER.map(day => {
  const s = (business.schedule as any)?.[day]
  if (!s) return null

  return (
    <div key={day} className="flex items-center justify-between text-sm">
      <span className="text-gray-600 font-medium">
        {DAY_LABELS[day]}
      </span>

  {s.closed ? (
  <span className="text-red-500 font-semibold">
    Cerrado
  </span>
) : (
  <span className="text-gray-800 font-semibold">
    {s.shifts?.map((shift: any) =>
      `${shift.open} - ${shift.close}`
    ).join(' | ')} hs
  </span>
)}
    </div>
  )
})}
                </div>
              </div>
            )}

            

            {business.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {business.tags.map(tag => (
                  <span key={tag} className="bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'galeria' && (
          <div>
            {media.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Images className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Sin galería disponible</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {media.map((item, i) => (
                  <div key={item.id} className={cn('relative bg-gray-100 overflow-hidden rounded-xl', i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square')}>
                    <Image src={item.url} alt={item.caption || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
