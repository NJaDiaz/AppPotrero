'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, MapPin, Trash2, ToggleLeft, ToggleRight, Loader2, X, Star, Edit2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import ImageUploader from '@/components/admin/ImageUploader'
import { toast } from 'sonner'
import type { Place } from '@/types'

const EMPTY = {
  name:'', short_description:'', description:'', image_url:'',
  latitude:'-33.1833', longitude:'-66.2167', category:'', is_featured:false,
}

export default function AdminLugaresPage() {
  const [places, setPlaces]   = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [gallery, setGallery] = useState<string[]>([])
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('places').select('*').order('order_index')
    setPlaces(data || [])
    setLoading(false)
  }

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const startEdit = (place: Place) => {
    setEditingId(place.id)
    setForm({
      name: place.name,
      short_description: place.short_description || '',
      description: place.description || '',
      image_url: place.image_url || '',
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
      category: place.category || '',
      is_featured: place.is_featured,
    })
    setGallery(place.gallery || [])
    setShowForm(true)
  }

  const startNew = () => {
    setEditingId(null)
    setForm(EMPTY)
    setGallery([])
    setShowForm(true)
  }

  const addGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return
    setGallery(p => [...p, newGalleryUrl.trim()])
    setNewGalleryUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: any = {
        name: form.name.trim(),
        short_description: form.short_description || null,
        description: form.description || null,
        image_url: form.image_url || null,
        gallery,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        category: form.category || null,
        is_featured: form.is_featured,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { error } = await supabase.from('places').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success('Lugar actualizado')
      } else {
        payload.slug = generateSlug(form.name) + '-' + Date.now().toString(36)
        payload.order_index = places.length
        payload.is_active = true
        const { error } = await supabase.from('places').insert(payload)
        if (error) throw error
        toast.success('Lugar creado')
      }
      setShowForm(false)
      setForm(EMPTY)
      setGallery([])
      setEditingId(null)
      load()
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar')
    }
    setSaving(false)
  }

  const toggle = async (p: Place) => {
    await supabase.from('places').update({ is_active: !p.is_active }).eq('id', p.id)
    setPlaces(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este lugar?')) return
    await supabase.from('places').delete().eq('id', id)
    setPlaces(prev => prev.filter(p => p.id !== id))
    toast.success('Lugar eliminado')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display font-bold text-gray-900">Lugares para visitar</h1>
          </div>
          <button onClick={() => showForm ? setShowForm(false) : startNew()} className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-3 py-2 rounded-xl shadow-brand">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-card space-y-4">
            <h2 className="font-bold text-gray-900">{editingId ? 'Editar lugar' : 'Nuevo lugar'}</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nombre *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Quebrada de los Cóndores"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Tipo (opcional)</label>
              <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="Ej: Mirador, Cascada, Sendero"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Descripción corta</label>
              <input value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="Frase para el carrusel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Descripción completa</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none" />
            </div>
            <ImageUploader
              label="Imagen principal"
              value={form.image_url}
              onChange={v => set('image_url', v)}
              bucket="place-images"
              aspectRatio="cover"
            />

            {/* Galería */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Galería adicional</label>
              <div className="flex gap-2 mb-2">
                <input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} placeholder="URL de imagen..."
                  onKeyDown={e => { if (e.key==='Enter'){ e.preventDefault(); addGalleryUrl() } }}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400" />
                <button type="button" onClick={addGalleryUrl} className="bg-brand-50 text-brand-600 px-3 rounded-xl"><Plus className="w-4 h-4" /></button>
              </div>
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((url, i) => (
                    <div key={i} className="relative h-20 rounded-lg overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setGallery(p => p.filter((_,idx)=>idx!==i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Latitud *</label>
                <input required value={form.latitude} onChange={e => set('latitude', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Longitud *</label>
                <input required value={form.longitude} onChange={e => set('longitude', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-brand-400" />
              </div>
            </div>
            <button type="button"
              onClick={() => navigator.geolocation?.getCurrentPosition(p => {
                set('latitude', p.coords.latitude.toFixed(6)); set('longitude', p.coords.longitude.toFixed(6))
              })}
              className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 font-bold py-2.5 rounded-xl text-sm">
              <MapPin className="w-4 h-4" /> Usar mi ubicación actual
            </button>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="rounded accent-brand-500" />
              ★ Destacar en el carrusel del inicio
            </label>

            <button type="submit" disabled={saving} className="w-full bg-brand-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editingId ? 'Guardar cambios' : 'Crear lugar'}
            </button>
          </form>
        )}

        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl skeleton" />)
        ) : places.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Sin lugares cargados</p>
          </div>
        ) : (
          places.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-start gap-3">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      {p.name}
                      {p.is_featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Activo' : 'Oculto'}
                    </span>
                  </div>
                  {p.category && <p className="text-xs text-brand-500 font-semibold">{p.category}</p>}
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{p.short_description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => startEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-brand-50 text-brand-600 rounded-xl text-xs font-bold">
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => toggle(p)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                  {p.is_active ? <ToggleRight className="w-4 h-4 text-brand-500" /> : <ToggleLeft className="w-4 h-4" />}
                  {p.is_active ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => remove(p.id)} className="px-3 bg-red-50 text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
