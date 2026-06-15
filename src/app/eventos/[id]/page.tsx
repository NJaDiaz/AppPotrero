'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Share2, CalendarDays, Navigation } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getDirectionsUrl } from '@/lib/utils'
import BottomNav from '@/components/shared/BottomNav'
import type { Event } from '@/types'

export default function EventoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('events').select('*').eq('id', id).single()
      .then(({ data }) => { setEvent(data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">Evento no encontrado</p>
        <Link href="/eventos" className="text-brand-500 font-semibold text-sm mt-2 block">← Ver eventos</Link>
      </div>
    </div>
  )

  const date = new Date(event.starts_at)
  const endDate = event.ends_at ? new Date(event.ends_at) : null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative h-72">
        {event.image_url ? (
          <Image src={event.image_url} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => navigator.share?.({ title: event.title, url: window.location.href })}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-card-hover">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-brand-500 text-white rounded-2xl p-3 text-center min-w-[60px] flex-shrink-0">
              <div className="font-display font-black text-2xl leading-none">{date.getDate()}</div>
              <div className="text-[10px] font-bold uppercase mt-0.5">{date.toLocaleDateString('es-AR', { month: 'short' })}</div>
            </div>
            <div>
              <h1 className="font-display font-black text-gray-900 text-xl leading-tight">{event.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {event.is_free ? (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg">ENTRADA LIBRE</span>
                ) : event.price ? (
                  <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-lg">${event.price}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <div>
                <span className="font-semibold">{date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
                {endDate && <span className="text-gray-400"> → {endDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>}
                <span className="block text-gray-400 text-xs">
                  {date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span className="font-semibold">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-bold text-gray-900 mb-3">Sobre el evento</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
        </div>

        {event.latitude && event.longitude && (
          <button onClick={() => window.open(getDirectionsUrl(event.latitude!, event.longitude!, event.title), '_blank')}
            className="w-full bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-brand flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" /> Cómo llegar
          </button>
        )}

        <button onClick={() => navigator.share?.({ title: event.title, url: window.location.href })}
          className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" /> Compartir evento
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
