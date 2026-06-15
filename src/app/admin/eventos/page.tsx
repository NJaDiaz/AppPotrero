'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, CalendarDays, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Event } from '@/types'

const EMPTY = { title:'', description:'', location:'', image_url:'', starts_at:'', ends_at:'', is_free:true, price:'' }

export default function AdminEventosPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('events').insert({
      title: form.title,
      description: form.description,
      location: form.location,
      image_url: form.image_url || null,
      starts_at: form.starts_at,
      ends_at: form.ends_at || null,
      is_free: form.is_free,
      price: !form.is_free && form.price ? parseFloat(form.price) : null,
      is_active: true,
    })
    if (error) toast.error('Error al crear evento')
    else { toast.success('Evento creado'); setShowForm(false); setForm(EMPTY); load() }
    setSaving(false)
  }

  const toggle = async (ev: Event) => {
    await supabase.from('events').update({ is_active: !ev.is_active }).eq('id', ev.id)
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, is_active: !e.is_active } : e))
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return
    await supabase.from('events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
    toast.success('Evento eliminado')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display font-bold text-gray-900">Eventos</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-3 py-2 rounded-xl shadow-brand">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-4 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">Nuevo evento</h2>
            {[
              { label:'Título', key:'title', placeholder:'Festival de Música' },
              { label:'Lugar', key:'location', placeholder:'Anfiteatro Municipal' },
              { label:'URL de imagen (opcional)', key:'image_url', placeholder:'https://...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">{label}</label>
                <input required={key!=='image_url'} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Descripción</label>
              <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Fecha y hora inicio *</label>
                <input required type="datetime-local" value={form.starts_at} onChange={e => set('starts_at', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Fin (opcional)</label>
                <input type="datetime-local" value={form.ends_at} onChange={e => set('ends_at', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} className="rounded accent-brand-500" />
                Entrada libre
              </label>
              {!form.is_free && (
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Precio ($)"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
              )}
            </div>
            <button type="submit" disabled={saving} className="w-full bg-brand-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear evento
            </button>
          </form>
        )}

        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl skeleton" />)
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Sin eventos</p>
          </div>
        ) : (
          events.map(ev => {
            const date = new Date(ev.starts_at)
            return (
              <div key={ev.id} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="bg-brand-50 text-brand-500 rounded-xl p-2.5 flex-shrink-0 text-center min-w-[48px]">
                    <div className="font-display font-black text-xl leading-none">{date.getDate()}</div>
                    <div className="text-[9px] font-bold uppercase">{date.toLocaleDateString('es-AR',{month:'short'})}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{ev.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${ev.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {ev.is_active ? 'Activo' : 'Pausado'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{ev.location}</p>
                    <p className="text-xs text-gray-400">{date.toLocaleDateString('es-AR',{weekday:'long',hour:'2-digit',minute:'2-digit'})} hs · {ev.is_free ? 'Gratis' : `$${ev.price}`}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggle(ev)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                    {ev.is_active ? <ToggleRight className="w-4 h-4 text-brand-500" /> : <ToggleLeft className="w-4 h-4" />}
                    {ev.is_active ? 'Pausar' : 'Activar'}
                  </button>
                  <button onClick={() => remove(ev.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
