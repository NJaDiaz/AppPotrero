'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronRight } from 'lucide-react'
import type { Place } from '@/types'

interface Props { places: Place[] }

export default function PlacesCarousel({ places }: Props) {
  if (places.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-3 space-y-10">
        <div>
          <h2 className="font-display font-bold text-gray-900 text-base">Lugares para visitar</h2>
          <p className="text-xs text-gray-400">Los rincones más lindos de Potrero</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
        {places.map(place => (
          <Link key={place.id} href={`/lugares/${place.slug}`}
            className="flex-shrink-0 w-64 rounded-2xl overflow-hidden bg-white shadow-card card-hover relative">
            <div className="relative h-40">
              {place.image_url ? (
                <Image src={place.image_url} alt={place.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-brand-200" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              {place.category && (
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-brand-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                  {place.category}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-display font-bold text-white text-base leading-tight">{place.name}</h3>
                {place.short_description && (
                  <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{place.short_description}</p>
                )}
              </div>
              <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
