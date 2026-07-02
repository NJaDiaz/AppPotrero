'use client'
import { useState, useRef } from 'react'
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

  // 🖼 LIGHTBOX STATE
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const allImages = [
    ...(business.cover_url ? [business.cover_url] : []),
    ...media.map(m => m.url)
  ]

  const openImage = (url: string) => {
    const index = allImages.findIndex(i => i === url)
    setSelectedIndex(index)
    setSelectedImage(url)
  }

  const touchStartX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage()
      else prevImage()
    }
    touchStartX.current = null
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const newIndex = (selectedIndex - 1 + allImages.length) % allImages.length
    setSelectedIndex(newIndex)
    setSelectedImage(allImages[newIndex])
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const newIndex = (selectedIndex + 1) % allImages.length
    setSelectedIndex(newIndex)
    setSelectedImage(allImages[newIndex])
  }

  const handleWhatsApp = () => {
    if (business.whatsapp) {
      window.open(
        getWhatsAppUrl(
          business.whatsapp,
          `Hola ${business.name}! Te contacto desde la app de la CCTA Potrero de los Funes`
        ),
        '_blank'
      )
    }
  }

  function ActionButton({
  icon,
  label,
  onClick,
  color = "gray",
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: "brand" | "green" | "blue" | "pink" | "gray"
}) {
  const styles = {
    brand: "bg-brand-50 text-brand-600 hover:bg-brand-100",
    green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    pink: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    gray: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        min-w-[84px] py-3 px-3
        rounded-2xl
        transition-all duration-200
        active:scale-95
        shadow-sm hover:shadow-md
        ${styles[color]}
      `}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[11px] font-semibold leading-none text-center">
        {label}
      </span>
    </button>
  )
}

  const handleDirections = () => {
    window.open(
      getDirectionsUrl(business.latitude, business.longitude, business.name),
      '_blank'
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: business.name,
        text: business.short_description || business.name,
        url: window.location.href
      })
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

      <div className="bg-white shadow-sm border-b border-gray-100">
  <div className="max-w-lg mx-auto px-4 pt-5 pb-4">

    {/* HEADER INFO */}
    <div className="flex items-start gap-3">
      
      {/* LOGO */}
      {business.logo_url && (
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 -mt-8 bg-white">
          <Image
            src={business.logo_url}
            alt={business.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* INFO */}
      <div className="flex-1 min-w-0">
        
        <div className="flex items-center gap-2">
          <h1 className="font-display font-black text-gray-900 text-xl leading-tight">
            {business.name}
          </h1>

          {business.is_verified && (
            <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
          )}
        </div>

        <span
          className="text-sm font-semibold"
          style={{ color: category?.color }}
        >
          {category?.label}
        </span>

        {/* STATUS */}
        {hasSchedule && (
          <div className="mt-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-semibold",
                isOpen ? "text-emerald-600" : "text-red-500"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {isOpen ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* ACTIONS */}
    <div className="mt-5">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

        <ActionButton
          onClick={handleDirections}
          icon={<Navigation className="w-5 h-5" />}
          label="Cómo llegar"
          color="brand"
        />

        {business.whatsapp && (
          <ActionButton
            onClick={handleWhatsApp}
            icon={<MessageCircle className="w-5 h-5" />}
            label="WhatsApp"
            color="green"
          />
        )}

        {business.phone && (
          <ActionButton
            onClick={() => window.open(`tel:${business.phone}`, "_self")}
            icon={<Phone className="w-5 h-5" />}
            label="Llamar"
            color="blue"
          />
        )}

        {business.instagram && (
          <ActionButton
            onClick={() =>
              window.open(`https://instagram.com/${business.instagram}`, "_blank")
            }
            icon={<Instagram className="w-5 h-5" />}
            label="Instagram"
            color="pink"
          />
        )}

        {business.website && (
          <ActionButton
            onClick={() => window.open(business.website!, "_blank")}
            icon={<Globe className="w-5 h-5" />}
            label="Web"
            color="gray"
          />
        )}

      </div>
    </div>

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
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Clock className="w-4 h-4 text-gray-400" />
      Horarios
    </h3>

    <div className="space-y-3">
      {DAY_ORDER.map(day => {
        const s = (business.schedule as any)?.[day]
        if (!s) return null

        const isClosed = s.closed

        return (
          <div
            key={day}
            className="flex items-start justify-between rounded-xl px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* Día */}
            <div className="w-28">
              <span className="text-sm font-semibold text-gray-700">
                {DAY_LABELS[day]}
              </span>
            </div>

            {/* Horarios */}
            <div className="flex-1 flex flex-wrap gap-2 justify-end">
              {isClosed ? (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600">
                  Cerrado
                </span>
              ) : (
                <>
                  {s.shifts?.map((shift: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm"
                    >
                      {shift.open} – {shift.close}
                    </span>
                  ))}

                  <span className="text-xs text-gray-400 ml-1 self-center">
                    hs
                  </span>
                </>
              )}
            </div>
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
                  <div
  key={item.id}
  className={cn(
    'relative bg-gray-100 overflow-hidden rounded-xl cursor-zoom-in',
    i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
  )}
  onClick={() => openImage(item.url)}
>
  <Image src={item.url} alt={item.caption || ''} fill className="object-cover" />
</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedImage && (
  <div
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="relative w-full h-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={selectedImage}
        alt="preview"
        fill
        className="object-contain select-none"
        priority
      />
    </div>

    <button
      className="absolute top-4 right-4 text-white bg-white/10 px-3 py-1 rounded-lg"
      onClick={() => setSelectedImage(null)}
    >
      Cerrar
    </button>

    {allImages.length > 1 && (
      <button
        onClick={prevImage}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-10 h-10 bg-white/10 rounded-full"
      >
        ‹
      </button>
    )}

    {allImages.length > 1 && (
      <button
        onClick={nextImage}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-10 h-10 bg-white/10 rounded-full"
      >
        ›
      </button>
    )}

    <div className="absolute bottom-5 text-white text-xs bg-white/10 px-3 py-1 rounded-full">
      {selectedIndex + 1} / {allImages.length}
    </div>
  </div>
)}

      <BottomNav />
    </div>
  )
}
