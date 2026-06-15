'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const EMPTY = { title:'', subtitle:'', image_url:'', link_url:'' }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('banners').select('*').order('order_index')
    setBanners(data || [])
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('banners').insert({
      title: form.title, subtitle: form.subtitle || null, image_url: form.image_url,
      link_url: form.link_url || null, is_active: true, order_index: banners.length,
    })
    if (error) toast.error('Error al crear banner')
    else { toast.success('Banner creado'); setShowForm(false); setForm(EMPTY); load() }
    setSaving(false)
  }

  const toggle = async (b: any) => {
    await supabase.from('banners').update({ is_active: !b.is_active }).eq('id', b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, is_active: !x.is_active } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar?')) return
    await supabase.from('banners').delete().eq('id', id)
    setBanners(prev => prev.filter(x => x.id !== id))
    toast.success('Banner eliminado')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display font-bold text-gray-900">Banners</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-3 py-2 rounded-xl shadow-brand">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-4 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">Nuevo banner</h2>
            {[
              { label:'Título', key:'title', placeholder:'CCTA Potrero de los Funes', req:true },
              { label:'Subtítulo (opcional)', key:'subtitle', placeholder:'Descubrí nuestra ciudad' },
              { label:'URL de imagen *', key:'image_url', placeholder:'https://...', req:true },
              { label:'Link al hacer click (opcional)', key:'link_url', placeholder:'/mapa' },
            ].map(({ label, key, placeholder, req }) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm(p => ({...p,[key]:e.target.value}))} placeholder={placeholder} required={req}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
              </div>
            ))}
            {form.image_url && <img src={form.image_url} alt="" className="h-32 w-full object-cover rounded-xl" />}
            <button type="submit" disabled={saving} className="w-full bg-brand-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear banner
            </button>
          </form>
        )}

        {loading ? (
          Array(2).fill(0).map((_, i) => <div key={i} className="h-36 bg-gray-100 rounded-2xl skeleton" />)
        ) : banners.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><p className="font-semibold">Sin banners</p></div>
        ) : (
          banners.map(b => (
            <div key={b.id} className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="relative h-32">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  {b.subtitle && <p className="text-white/70 text-xs">{b.subtitle}</p>}
                </div>
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-lg ${b.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {b.is_active ? 'Activo' : 'Oculto'}
                </span>
              </div>
              <div className="p-3 flex gap-2">
                <button onClick={() => toggle(b)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                  {b.is_active ? <ToggleRight className="w-4 h-4 text-brand-500" /> : <ToggleLeft className="w-4 h-4" />}
                  {b.is_active ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => remove(b.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
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
