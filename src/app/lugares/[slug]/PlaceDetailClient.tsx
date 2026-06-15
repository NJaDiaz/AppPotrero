'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Navigation, Share2 } from 'lucide-react'
import { getDirectionsUrl } from '@/lib/utils'
import BottomNav from '@/components/shared/BottomNav'
import type { Place } from '@/types'

export default function PlaceDetailClient({ place }: { place: Place }) {
  const router = useRouter()
  const [activeImg, setActiveImg] = useState(0)
  const allImages = [place.image_url, ...(place.gallery || [])].filter(Boolean) as string[]

  const handleDirections = () => {
    window.open(getDirectionsUrl(place.latitude, place.longitude, place.name), '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: place.name, text: place.short_description || place.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative h-72">
        {allImages[activeImg] ? (
          <Image src={allImages[activeImg]} alt={place.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-brand-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {place.category && (
            <span className="bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-2 inline-block">
              {place.category}
            </span>
          )}
          <h1 className="font-display font-black text-white text-2xl leading-tight">{place.name}</h1>
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white">
          {allImages.map((img, i) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === activeImg ? 'border-brand-500' : 'border-transparent opacity-60'}`}>
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {place.description && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="font-bold text-gray-900 mb-2">Sobre este lugar</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{place.description}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span>Lat {place.latitude.toFixed(5)}, Lng {place.longitude.toFixed(5)}</span>
          </div>
          <button onClick={handleDirections}
            className="w-full bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-brand flex items-center justify-center gap-2 text-base">
            <Navigation className="w-5 h-5" />
            Cómo llegar
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Se abrirá Google Maps o Apple Maps según tu dispositivo
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
