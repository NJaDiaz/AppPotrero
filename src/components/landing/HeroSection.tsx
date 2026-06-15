'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Map, Calendar, ChevronDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const HERO_IMAGES = [
  {
    url: 'https://turistasdeviaje.com/wp-content/uploads/2024/03/Lago-Potrero-de-los-Funes.jpg',
    label: 'Vista general de Potrero de los Funes',
  },
  {
    url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/97/71/42/dique-potrero-de-los.jpg?w=1000&h=600&s=1',
    label: 'Lago Potrero de los Funes',
  },
  {
    url: 'https://municipiosdeargentina.com/wp-content/uploads/2022/05/HotelPotrero_DSC_0034_300dpi.jpg',
    label: 'Naturaleza serrana',
  },
]

export function HeroSection() {
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === currentImg ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img.url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-orange-600/20" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
      

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
        >
          Cámara de{' '}
          <span className="text-brand-500">Comercio</span>
          <br />
          Turismo y Afines
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/85 text-xl md:text-2xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Conectamos comercios, turistas y la comunidad de Potrero de los Funes.
          Descubrí todo lo que nuestra ciudad tiene para ofrecerte.
        </motion.p>
      </div>

      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Link
            href="/app"
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/40
                       text-white font-semibold px-7 py-3.5 rounded-2xl 
                       hover:bg-white/25 transition-all duration-200 active:scale-95
                       w-full sm:w-auto justify-center"
          >
            <Map size={18} />
            Nuestra app
          </Link>
        </motion.div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImg(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentImg ? 'bg-brand-500 w-6' : 'bg-white/40'
            }`}
            aria-label={`Imagen ${idx + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce-soft">
        <ChevronDown size={28} className="text-white/60" />
      </div>
    </section>
  )
}
