'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, MapPin, Phone, MessageCircle, Tag, CalendarDays,
  Map, ChevronRight, Menu, X, ArrowRight, CheckCircle,
  Store, Clock, Megaphone, BarChart3, Smartphone, Users,
  Award, ShieldCheck
} from 'lucide-react'
import { CATEGORIES, CATEGORY_MAP } from '@/types'
import { isBusinessOpen } from '@/lib/utils'
import type { Business, Event, Category, Place } from '@/types'
import { HeroSection } from '../../components/landing/HeroSection'
import { AtractivosCarousel } from '@/components/landing/AtractivosCarousel'

interface Props {
  businesses: Business[]
  events: Event[]
  totalBusinesses: number
  places: Place[]
}

export default function LandingClient({ businesses, events, totalBusinesses, places }: Props) {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [scrolled, setScrolled]         = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
  setVisibleCount(8)
}, [activeCategory])

  const filtered = activeCategory === 'all'
    ? businesses
    : businesses.filter(b => b.category === activeCategory)

  const stats = [
    { value: `${totalBusinesses}+`, label: 'Comercios adheridos', icon: Store },
    { value: `${CATEGORIES.length}`, label: 'Rubros y categorías', icon: Tag },
    { value: `${places.length}+`, label: 'Lugares para visitar', icon: MapPin },
    { value: '100%', label: 'Local y gratuito', icon: CheckCircle },
  ]

  const benefits = [
    {
      icon: Map,
      title: 'Presencia en el mapa interactivo',
      desc: 'Tu comercio aparece georreferenciado en la app, fácil de encontrar para vecinos y turistas.',
    },
    {
      icon: Megaphone,
      title: 'Visibilidad en eventos y novedades',
      desc: 'Tu negocio puede formar parte de la agenda de eventos y novedades de la ciudad.',
    },
    {
      icon: BarChart3,
      title: 'Estadísticas de visitas',
      desc: 'La Cámara realiza un seguimiento de las visitas e interacciones de tu perfil.',
    },
    {
      icon: Smartphone,
      title: 'Ficha completa y profesional',
      desc: 'Foto de portada, logo, galería, horarios, WhatsApp y redes — todo en un solo lugar.',
    },
    {
      icon: Users,
      title: 'Networking entre socios',
      desc: 'Formá parte de la red de comercios, turismo y servicios de Potrero de los Funes.',
    },
    {
      icon: ShieldCheck,
      title: 'Sello de comercio verificado',
      desc: 'Los socios de la CCTA cuentan con una insignia de verificación que genera confianza.',
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">

          <Link href="/landing" className="flex items-center gap-3">
            <Image src="/logo-ccta.jpeg" alt="CCTA" width={44} height={44} className="rounded-xl object-contain" />
            <div className="leading-tight">
              <div className={`font-display font-black text-base tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                CCTA
              </div>
              <div className="font-semibold text-[9px] text-brand-500 -mt-0.5 tracking-wide">
                Potrero de los Funes
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { href:'#comercios', label:'Comercios' },
              { href:'#lugares',   label:'Lugares' },
              { href:'#eventos',   label:'Eventos' },
              { href:'#beneficios',label:'Beneficios' },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className={`text-sm font-semibold transition-colors hover:text-brand-400 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/app"
              className="bg-brand-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-brand hover:bg-brand-600 transition-colors">
              Abrir App →
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-5 py-4 space-y-4">
              {[
                { href:'#comercios', label:'Comercios' },
                { href:'#lugares',   label:'Lugares' },
                { href:'#eventos',   label:'Eventos' },
                { href:'#beneficios',label:'Beneficios' },
              ].map(({ href, label }) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 font-semibold text-sm py-1">{label}</a>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <Link href="/app"
                  className="block text-center bg-brand-500 text-white font-bold text-sm py-2.5 rounded-xl">
                  Abrir App
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

       <HeroSection />
       {/* <AtractivosCarousel /> */}

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Image src="/logo-ccta.jpeg" alt="CCTA" width={36} height={36} className="rounded-lg" />
                <span className="bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1 rounded-full">
                  Sobre la Cámara
                </span>
              </div>
              <h2 className="font-display font-black text-gray-900 text-4xl leading-tight mb-5">
                Cámara de Comercio,<br />Turismo y Afines
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                La Cámara de Comercio, Turismo y
Afines es una entidad comprometida
con la unificación de criterios
comerciales en diversos sectores, así
como la promoción y desarrollo del
turismo. Conformada por un grupo
diverso de emprendedores,
empresarios y profesionales, esta
Cámara se propone fortalecer la
economía local, fomentar el turismo
sostenible y brindar servicios de
calidad a sus miembros.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                La CCTA de Potrero de los Funes reúne a todos los comercios, emprendimientos turísticos y negocios de la ciudad en un directorio digital moderno. Descubrí todo lo que Potrero tiene para ofrecer.
              </p>
              <div className="space-y-3">
                {[
                  'Mapa interactivo con todos los comercios adheridos',
                  'Información completa de cada negocio con contacto directo',
                  'Agenda de eventos y novedades de la ciudad',
                  'Lugares turísticos imperdibles para visitar',
                  'Disponible como app en tu celular (PWA)',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[440px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
                  alt="Potrero de los Funes" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                      <Map className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">Potrero de los Funes</p>
                      <p className="text-xs text-gray-500">{totalBusinesses} comercios en el mapa</p>
                    </div>
                    <Link href="/mapa" className="text-brand-500 font-bold text-xs flex items-center gap-1">
                      Ver <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-gray-900 text-4xl mb-3">Explorá por categoría</h2>
            <p className="text-gray-500 text-lg">Encontrá exactamente lo que buscás</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => {
              const count = businesses.filter(b => b.category === cat.key).length
              return (
                <Link key={cat.key} href={`/categoria/${cat.key}`}>
                  <div className="group p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-200 transition-all cursor-pointer card-hover text-center"
                    style={{ background: cat.bgColor }}>
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-bold text-gray-900 text-sm">{cat.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{count} {count === 1 ? 'comercio' : 'comercios'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section> */}

      {places.length > 0 && (
        <section id="lugares" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-10">
              <div className="inline-block bg-brand-50 text-brand-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">
                Para descubrir
              </div>
              <h2 className="font-display font-black text-gray-900 text-4xl mb-3">Lugares para visitar</h2>
              <p className="text-gray-500 text-lg">Los rincones más lindos de Potrero de los Funes</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {places.map(place => (
                <Link key={place.id} href={`/lugares/${place.slug}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-card card-hover h-64">
                    {place.image_url ? (
                      <Image src={place.image_url} alt={place.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {place.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {place.category}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display font-bold text-white text-lg leading-tight">{place.name}</h3>
                      {place.short_description && (
                        <p className="text-white/80 text-xs mt-1 line-clamp-2">{place.short_description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="comercios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-brand-50 text-brand-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">
              Directorio completo
            </div>
            <h2 className="font-display font-black text-gray-900 text-4xl mb-3">Comercios adheridos</h2>
            <p className="text-gray-500 text-lg">Todos los negocios de Potrero de los Funes</p>
          </div>

          <div className="mb-10">
  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">

    <button
      onClick={() => setActiveCategory('all')}
      className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
        activeCategory === 'all'
          ? 'bg-brand-500 text-white shadow-xl'
          : 'bg-white border border-gray-200 text-gray-700 hover:shadow-md'
      }`}
    >
      <Store className="w-4 h-4" />
      <span className="font-semibold text-sm">
        Todos
      </span>
    </button>

    {CATEGORIES.map(cat => (
      <button
        key={cat.key}
        onClick={() => setActiveCategory(cat.key)}
        className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
          activeCategory === cat.key
            ? 'text-white shadow-xl'
            : 'bg-white border border-gray-200 text-gray-700 hover:shadow-md'
        }`}
        style={
          activeCategory === cat.key
            ? { backgroundColor: cat.color }
            : {}
        }
      >
        <span className="text-lg">
          {cat.icon}
        </span>

        <span className="font-semibold text-sm whitespace-nowrap">
          {cat.label}
        </span>
      </button>
    ))}

  </div>
</div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">Sin comercios en esta categoría</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.slice(0, visibleCount).map(biz => {                const cat = CATEGORY_MAP[biz.category]
                const open = isBusinessOpen(biz.schedule)
                return (
<div
  key={biz.id}
  onClick={() => router.push(`/comercio/${biz.slug}`)}
  className="bg-white rounded-2xl overflow-hidden shadow-card card-hover border border-gray-100 h-full cursor-pointer"
>
                      <div className="relative h-40">
                        {biz.cover_url
                          ? <Image src={biz.cover_url} alt={biz.name} fill className="object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-5xl"
                              style={{ background: cat?.bgColor }}>{cat?.icon}</div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {biz.is_featured && (
                          <div className="absolute top-2 left-2 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">
                            ★ Destacado
                          </div>
                        )}
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{biz.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-semibold" style={{ color: cat?.color }}>{cat?.label}</span>
                          {biz.schedule && (
                            <span className={`text-xs font-semibold ${open ? 'text-emerald-600' : 'text-red-500'}`}>● {open ? 'Abierto' : 'Cerrado'}</span>
                          )}
                        </div>
                        <div className="flex gap-1.5 mt-3">
                          {biz.whatsapp && (
                            <a href={`https://wa.me/${biz.whatsapp.replace(/\D/g,'')}`} target="_blank"
                              onClick={e => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold">
                              <MessageCircle className="w-3.5 h-3.5" /> WA
                            </a>
                          )}
                          {biz.phone && (
                            <a href={`tel:${biz.phone}`} onClick={e => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold">
                              <Phone className="w-3.5 h-3.5" /> Llamar
                            </a>
                          )}
                          <span className="flex-1 flex items-center justify-center py-2 bg-brand-50 text-brand-600 rounded-xl text-[10px] font-bold">
                            Ver →
                          </span>
                        </div>
                      </div>
                  </div>
                )
              })}
            </div>
          )}

<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">

  {visibleCount < filtered.length && (
    <button
      onClick={() => setVisibleCount(prev => prev + 8)}
      className="px-7 py-3 rounded-2xl bg-white border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all"
    >
      Cargar más
    </button>
  )}

  <Link
    href="/buscar"
    className="px-7 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all shadow-brand"
  >
    Ver todos los comercios →
  </Link>

</div>
          <Link href="/mapa" className="block">
  <div className="relative my-4 overflow-hidden rounded-[30px] bg-gradient-to-br from-brand-500 via-brand-500 to-brand-400 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-brand">

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
        </div>
      </section>

      {events.length > 0 && (
        <section id="eventos" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-block bg-brand-50 text-brand-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">
                  Agenda
                </div>
                <h2 className="font-display font-black text-gray-900 text-4xl">Próximos eventos</h2>
              </div>
              <Link href="/eventos" className="hidden sm:flex items-center gap-1.5 text-brand-500 font-bold text-sm">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {events.map(ev => {
                const d = new Date(ev.starts_at)
                return (
                  <Link key={ev.id} href={`/eventos/${ev.id}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-card card-hover flex">
                      {ev.image_url && (
                        <div className="relative w-28 flex-shrink-0">
                          <Image src={ev.image_url} alt={ev.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-center flex-shrink-0">
                            <div className="font-display font-black text-brand-500 text-2xl leading-none">{d.getDate()}</div>
                            <div className="text-gray-400 text-[9px] font-bold uppercase">
                              {d.toLocaleDateString('es-AR', { month: 'short' })}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{ev.title}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{ev.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {d.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' })} hs
                          </span>
                          {ev.is_free && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                              GRATIS
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section id="beneficios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              <Award className="w-3.5 h-3.5" /> Para socios de la Cámara
            </div>
            <h2 className="font-display font-black text-gray-900 text-4xl sm:text-5xl leading-tight mb-4">
              Beneficios de ser parte<br />de la CCTA
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Los comercios adheridos a la Cámara acceden a estos beneficios dentro de la plataforma digital.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-brand-200 transition-colors">
                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-4 shadow-brand">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-50 rounded-3xl p-8 max-w-xl mx-auto border border-brand-100 mt-12 text-center">
            <Image src="/logo-ccta.jpeg" alt="CCTA" width={56} height={56} className="rounded-xl mx-auto mb-4" />
            <h3 className="font-display font-bold text-gray-900 text-xl mb-2">¿Querés sumarte a la CCTA?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Escribinos por WhatsApp para conocer los requisitos de adhesión y cuotas de membresía.
            </p>
            <Link href="https://wa.me/5492665069204?text=Hola!%20Quiero%20información%20para%20adherirme%20a%20la%20CCTA%20Potrero%20de%20los%20Funes"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-600 transition-colors w-full">
              <MessageCircle className="w-5 h-5" />
              WhatsApp de la CCTA
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-500 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <h2 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
            Instalá la app en tu celular
          </h2>
          <p className="text-white/75 text-xl mb-8">Funciona como una app nativa. Sin descargar nada de la tienda.</p>
          <Link href="/app"
            className="inline-flex items-center gap-3 bg-white text-brand-600 font-display font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <span className="text-2xl">📱</span> Abrir la App
          </Link>
          <p className="text-white/50 text-sm mt-4">Compartir → "Agregar a inicio" para instalarla</p>
        </div>
      </section>

      <footer className="bg-white text-black py-14">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo-ccta.jpeg" alt="CCTA" width={44} height={44} className="rounded-xl" />
                <div>
                  <div className="font-display font-black text-sm">CCTA</div>
                  <div className="text-[9px] text-brand-500 font-semibold">Potrero de los Funes</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Cámara de Comercio, Turismo y Afines de Potrero de los Funes, San Luis, Argentina.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-600 uppercase tracking-wide">Explorar</h4>
              <div className="space-y-2.5">
                {[
                  { href:'/app',      label:'App' },
                  { href:'/mapa',     label:'Mapa interactivo' },
                  { href:'/eventos',  label:'Eventos' },
                  { href:'/novedades',label:'Novedades' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="block text-gray-700 hover:text-brand-500 text-sm transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-600 uppercase tracking-wide">Cámara</h4>
              <div className="space-y-2.5">
                {[
                  { href:'#beneficios', label:'Beneficios para socios' },
                  { href:'#comercios',  label:'Directorio de comercios' },
                  { href:'#lugares',    label:'Lugares para visitar' },
                ].map(({ href, label }) => (
                  <a key={href} href={href}
                    className="block text-gray-700 hover:text-brand-500 text-sm transition-colors">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-gray-600 uppercase tracking-wide">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  Potrero de los Funes, San Luis
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <a href="tel:+5492665069204" className="hover:text-brand-500 transition-colors">+54 9 2665 069204</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-black text-sm">© 2026 CCTA Potrero de los Funes. Todos los derechos reservados.</p>
            <p className="text-black text-xs flex items-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-black" /> por
            <a
               href="https://www.velocitstudio.com"
                className="hover:text-brand-500 ml-1"
            >
              Velocit Studio
            </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
