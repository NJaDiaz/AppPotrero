'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Newspaper, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { News } from '@/types'

const EMPTY = { title:'', body:'', image_url:'', link_url:'' }

export default function AdminNovedadesPage() {
  const [news, setNews]       = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false })
    setNews(data || [])
    setLoading(false)
  }

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('news').insert({
      title: form.title,
      body: form.body,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
      is_active: true,
      published_at: new Date().toISOString(),
    })
    if (error) toast.error('Error al crear novedad')
    else { toast.success('Novedad publicada'); setShowForm(false); setForm(EMPTY); load() }
    setSaving(false)
  }

  const toggle = async (n: News) => {
    await supabase.from('news').update({ is_active: !n.is_active }).eq('id', n.id)
    setNews(prev => prev.map(x => x.id === n.id ? { ...x, is_active: !x.is_active } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    await supabase.from('news').delete().eq('id', id)
    setNews(prev => prev.filter(n => n.id !== id))
    toast.success('Novedad eliminada')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display font-bold text-gray-900">Novedades</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-3 py-2 rounded-xl shadow-brand">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Cancelar' : 'Nueva'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-4 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">Nueva novedad</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Título *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Nuevo horario de la temporada"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Contenido *</label>
              <textarea required value={form.body} onChange={e => set('body', e.target.value)} rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Imagen (opcional)</label>
              <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Link (opcional)</label>
              <input value={form.link_url} onChange={e => set('link_url', e.target.value)} placeholder="/comercio/mi-local o https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-brand-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Publicar
            </button>
          </form>
        )}

        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl skeleton" />)
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Sin novedades</p>
          </div>
        ) : (
          news.map(n => (
            <div key={n.id} className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-sm">{n.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${n.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {n.is_active ? 'Visible' : 'Oculto'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.body}</p>
              <p className="text-xs text-gray-300 mt-1">{new Date(n.published_at).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' })}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggle(n)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                  {n.is_active ? <ToggleRight className="w-4 h-4 text-brand-500" /> : <ToggleLeft className="w-4 h-4" />}
                  {n.is_active ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => remove(n.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
