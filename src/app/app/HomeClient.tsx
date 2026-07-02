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
        <div className="relative h-64 overflow-hidden">
          {banners.length > 0
            ? <Image src={banners[bannerIdx]?.image_url || ''}
                alt="Banner" fill className="object-cover" priority />
            : <div className="w-full h-full bg-gradient-to-br from-brand-500 to-orange-400" />
          }
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/75 text-sm font-medium mb-0.5">Cámara de Comercio, Turismo y Afines</p>
            <h1 className="font-display font-black text-white text-2xl leading-tight">
              Potrero de los Funes
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-light pb-2">
              Descubrí dónde hospedarte, comer, y qué hacer hoy.
            </p>
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
            className="flex items-center gap-2 bg-white rounded-2xl shadow-xl
border border-gray-100 px-4 py-3">
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

      <div className="px-4 mt-6 space-y-8 max-w-lg mx-auto">


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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg md:shadow-sm hover:scale-105
hover:shadow-lg"
                  style={{ background: cat.bgColor }}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600 whitespace-nowrap">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        
<Link href="/mapa" className="block">
  <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-brand-500 via-brand-500 to-brand-400 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-brand">

    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
    <div className="absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-white/5" />

    <div className="relative flex items-center gap-5">

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">

        <Map className="h-8 w-8 text-white" />

      </div>

      <div className="flex-1">

        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          MAPA INTERACTIVO
        </p>

        <h3 className="mt-1 font-display text-2xl font-black text-white">
          Explorá Potrero
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Encontrá comercios, gastronomía, alojamientos y lugares cerca tuyo.
        </p>

      </div>

      <ChevronRight className="h-7 w-7 text-white/80" />

    </div>

  </div>
</Link>
  
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

        {/* Eventos */}
{events.length > 0 && (
  <section>
    <div className="mb-5 flex items-end justify-between">

      <div>
        <h2 className="font-display text-xl font-black text-gray-900">
          🎉 Próximos eventos
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          No te pierdas todo lo que está pasando.
        </p>
      </div>

      <Link
        href="/eventos"
        className="flex items-center gap-1 text-sm font-bold text-brand-500 transition hover:text-brand-600"
      >
        Ver todos
        <ChevronRight className="h-4 w-4" />
      </Link>

    </div>

    <div className="space-y-4">

      {events.slice(0, 3).map((event) => {
        const date = new Date(event.starts_at)

        return (
          <Link
            key={event.id}
            href={`/eventos/${event.id}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="flex gap-4 p-4">

                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">

                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-50">
                      <CalendarDays className="h-8 w-8 text-brand-300" />
                    </div>
                  )}

                </div>

                <div className="flex flex-1 gap-4">

                  <div className="flex w-12 flex-col items-center justify-center rounded-2xl bg-brand-50">

                    <span className="font-display text-2xl font-black text-brand-600">
                      {date.getDate()}
                    </span>

                    <span className="text-[10px] font-bold uppercase text-brand-500">
                      {date.toLocaleDateString('es-AR', {
                        month: 'short',
                      })}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-base font-bold text-gray-900">
                      {event.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    {event.is_free && (
                      <span className="mt-3 inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1 text-[11px] font-bold text-white shadow">
                        GRATIS
                      </span>
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


{/* Comercios */}

<section>

  <div className="mb-5">
    

    <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-gray-900 text-xl">Todos los comercios</h2>
            <Link href="/buscar" className="text-brand-500 text-xs font-bold flex items-center gap-0.5">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

    <p className="mt-1 text-sm text-gray-500">
      Descubrí negocios locales recomendados.
    </p>
    

  </div>

  <div className="space-y-4">

    {all.map((b) => (
      <div
        key={b.id}
        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <BusinessCard
          business={b}
          variant="horizontal"
        />
      </div>
    ))}

  </div>

  <div className="my-8 flex justify-center">

    <Link
      href="/buscar"
      className="rounded-2xl border border-brand-200 bg-white px-6 py-3 font-semibold text-brand-600 shadow-sm transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-lg"
    >
      Ver todos los comercios
    </Link>

  </div>

</section>
      </div>

      <BottomNav />
    </div>
  )
}
