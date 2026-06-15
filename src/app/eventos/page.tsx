'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/shared/BottomNav'
import PageHeader from '@/components/shared/PageHeader'
import type { Event } from '@/types'

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('events').select('*').eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .then(({ data }) => { setEvents(data || []); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="Eventos" backHref="/app" />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl skeleton" />)
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-gray-600">Sin eventos próximos</h3>
            <p className="text-sm text-gray-400 mt-1">Volvé pronto para ver novedades</p>
          </div>
        ) : (
          events.map(event => {
            const date = new Date(event.starts_at)
            return (
              <Link key={event.id} href={`/eventos/${event.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card card-hover">
                  {event.image_url ? (
                    <div className="relative h-44">
                      <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 bg-brand-500 text-white font-display font-black text-2xl w-12 h-14 rounded-xl flex flex-col items-center justify-center leading-none">
                        <span>{date.getDate()}</span>
                        <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('es-AR', { month: 'short' })}</span>
                      </div>
                      {event.is_free ? (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">GRATIS</div>
                      ) : event.price ? (
                        <div className="absolute top-3 right-3 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-lg">${event.price}</div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="bg-brand-50 p-4 flex items-center gap-4">
                      <div className="bg-brand-500 text-white font-display font-black text-2xl w-14 h-16 rounded-xl flex flex-col items-center justify-center leading-none flex-shrink-0">
                        <span>{date.getDate()}</span>
                        <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('es-AR', { month: 'short' })}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {event.image_url && <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
                        {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}
