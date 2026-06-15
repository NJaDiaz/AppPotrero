'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const ATRACTIVOS = [
  {
    id: 1,
    nombre: 'Quebrada de los Cóndores',
    descripcion: 'Imponente formación rocosa con avistamiento de cóndores andinos en vuelo libre.',
    imagen: 'https://turismoenpotrerodelosfunes.com/assets/quebrada-condores-DVg4xGLM.jpg',
    distancia: '4 km del centro',
    dificultad: '',
    tipo: 'natural',
    color: 'from-amber-600/80',
  },
  {
    id: 2,
    nombre: 'Salto de la Moneda',
    descripcion: 'Cascada natural de aguas perfecta para refrescarse en el verano serrano.',
    imagen: 'https://agenciasanluis.com/wp-content/uploads/2025/12/SALTO-DE-LA-MONEDA-1.jpg',
    distancia: '6 km del centro',
    dificultad: 'Fácil',
    tipo: 'natural',
    color: 'from-blue-600/80',
  },
  {
    id: 3,
    nombre: 'La Salagria',
    descripcion: 'Paraje natural de singular belleza con aguas de características únicas en las sierras.',
    imagen: 'https://th.bing.com/th/id/R.02375692206aafa31093bc43169891d7?rik=i3FfqzIQWRRsDg&pid=ImgRaw&r=0',
    distancia: '8 km del centro',
    dificultad: 'Moderada',
    tipo: 'natural',
    color: 'from-teal-600/80',
  },
  {
    id: 4,
    nombre: 'Mirador Potrero de los Funes - La Punta',
    descripcion: 'Vista panorámica de 360° del lago y las sierras. El punto fotográfico más épico de la zona.',
    imagen: 'https://2.bp.blogspot.com/-NWYJSTu41Vk/UC7nYWxBh1I/AAAAAAAAAj4/hWVWITkDpdk/s1600/2.jpg',
    distancia: '3 km del centro',
    dificultad: 'Fácil',
    tipo: 'natural',
    color: 'from-orange-600/80',
  },
  {
    id: 5,
    nombre: 'Paseo del Lago',
    descripcion: 'Circuito costanero ideal para ciclismo, running y paseos en familia junto al agua.',
    imagen: 'https://tse2.mm.bing.net/th/id/OIP.coJHsLSw6gWSrNnq2jP0qwHaE8?r=0&pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3',
    distancia: 'Centro',
    dificultad: 'Fácil',
    tipo: 'deporte',
    color: 'from-green-600/80',
  },
]

const DIFICULTAD_COLOR: Record<string, string> = {
  Fácil: 'bg-green-100 text-green-800',
  Moderada: 'bg-amber-100 text-amber-800',
  Difícil: 'bg-red-100 text-red-800',
}

export function AtractivosCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const scroll = (dir: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    const width = container.clientWidth
    container.scrollBy({ left: dir === 'left' ? -width : width, behavior: 'smooth' })
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className=" items-center justify-between mb-8">
          <div className="text-center mb-10">
            <p className="text-brand-500 font-display text-2xl md:text-4xl uppercase tracking-wider mb-2">
              Descubrí Potrero
            </p>
            <h2 className="md:text-3xl text-xl font-bold text-gray-900">Atractivos Turísticos</h2>
            <p className="text-gray-500 mt-2">
              Naturaleza, aventura y paisajes únicos en las sierras puntanas
            </p>
          </div>
          {/* Controles desktop */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center
                         text-gray-600 hover:bg-ccta-500 hover:text-brand-500 hover:border-ccta-500
                         transition-all duration-200"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center
                         text-gray-600 hover:bg-ccta-500 hover:text-brand-500 hover:border-ccta-500
                         transition-all duration-200"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x-mandatory pb-4 -mx-4 px-4"
          onScroll={(e) => {
            const container = e.currentTarget
            const idx = Math.round(container.scrollLeft / (container.clientWidth * 0.75))
            setActiveIdx(idx)
          }}
        >
          {ATRACTIVOS.map((atractivo, idx) => (
            <div
              key={atractivo.id}
              className="snap-center flex-shrink-0 w-[75vw] sm:w-[380px] md:w-[340px]"
            >
              <div className="card-comercio group h-full cursor-pointer">
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${atractivo.imagen})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${atractivo.color} to-transparent opacity-60`} />
                  

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow-lg">
                      {atractivo.nombre}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {atractivo.descripcion}
                  </p>
                  <Link
                    href="/mapa"
                    className="inline-flex items-center gap-1.5 mt-3 text-ccta-500 font-medium text-sm
                               hover:gap-2.5 transition-all duration-200"
                  >
                    Ver en el mapa <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {ATRACTIVOS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIdx ? 'bg-brand-500 w-5' : 'bg-gray-200 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
