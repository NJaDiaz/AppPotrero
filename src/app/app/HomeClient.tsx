'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, ChevronRight, Star, MapPin, CalendarDays, Map, Newspaper } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'
import BusinessCard from '@/components/business/BusinessCard'
import PlacesCarousel from '@/components/places/PlacesCarousel'
import Logo from '@/components/shared/Logo'
import { CATEGORIES } from '@/types'
import type { Business, Event, Place } from '@/types'
import BackToLanding from '@/components/shared/BackToLanding'

interface Props {
  businesses: Business[]
  events: Event[]
  banners: any[]
  places: Place[]
}

export default function HomeClient({ businesses, events, banners, places }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [bannerIdx, setBannerIdx]     = useState(0)
  const router = useRouter()

  const featured = businesses.filter(b => b.is_featured).slice(0, 6)
  const all      = businesses.slice(0, 8)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <BackToLanding />
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Logo size="md" href="/landing" />
          <Link href="/novedades"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
            <Newspaper className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </Link>
        </div>
      </header>

      <div className="relative">
        <div className="relative h-60 overflow-hidden">
          {banners.length > 0
            ? <Image src={banners[bannerIdx]?.image_url || ''}
                alt="Banner" fill className="object-cover" priority />
            : <div className="w-full h-full bg-gradient-to-br from-brand-500 to-orange-400" />
          }
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/75 text-sm font-medium mb-0.5">Cámara de Comercio, Turismo y Afines</p>
            <h1 className="font-display font-black text-white text-2xl leading-tight">
              Potrero de los Funes
            </h1>
          </div>
          {banners.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              {banners.map((_: any, i: number) => (
                <button key={i} onClick={() => setBannerIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 -mt-5 relative z-10">
          <form onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white rounded-2xl shadow-card-hover px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="flex-1 text-gray-800 placeholder-gray-400 text-sm bg-transparent outline-none"
            />
            <button type="button" onClick={() => router.push('/buscar')}
              className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6 max-w-lg mx-auto">


        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-gray-900 text-base">Categorías</h2>
            <Link href="/buscar" className="text-brand-500 text-xs font-bold flex items-center gap-0.5">
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => (
              <Link key={cat.key} href={`/categoria/${cat.key}`}
                className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ background: cat.bgColor }}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600 whitespace-nowrap">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

  
        <PlacesCarousel places={places} />

        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-gray-900 text-base">Destacados</h2>
              <Link href="/buscar" className="text-brand-500 text-xs font-bold flex items-center gap-0.5">
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {featured.map(b => <BusinessCard key={b.id} business={b} variant="featured" />)}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-gray-900 text-base">Eventos próximos</h2>
              <Link href="/eventos" className="text-brand-500 text-xs font-bold flex items-center gap-0.5">
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {events.slice(0, 3).map(event => {
                const date = new Date(event.starts_at)
                return (
                  <Link key={event.id} href={`/eventos/${event.id}`}>
                    <div className="flex gap-3 bg-white rounded-2xl p-3 shadow-card card-hover">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        {event.image_url
                          ? <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                          : <div className="w-full h-full bg-brand-50 flex items-center justify-center"><CalendarDays className="w-8 h-8 text-brand-200" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="text-center flex-shrink-0 w-10">
                            <div className="font-display font-black text-brand-500 text-xl leading-none">{date.getDate()}</div>
                            <div className="text-gray-400 text-[9px] font-bold uppercase">
                              {date.toLocaleDateString('es-AR', { month: 'short' })}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{event.title}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500 truncate">{event.location}</span>
                            </div>
                            {event.is_free && (
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block">GRATIS</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <Link href="/mapa">
          <div className="bg-brand-500 rounded-2xl p-4 flex items-center gap-4 shadow-brand">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-white text-sm">Explorar el mapa interactivo</p>
              <p className="text-white/70 text-xs mt-0.5">Descubrí comercios cerca tuyo</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 flex-shrink-0" />
          </div>
        </Link>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-gray-900 text-base">Todos los comercios</h2>
            <Link href="/buscar" className="text-brand-500 text-xs font-bold flex items-center gap-0.5">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {all.map(b => <BusinessCard key={b.id} business={b} variant="horizontal" />)}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
