'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, MapPin, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Business, type Category } from '@/types'
import { generateSlug } from '@/lib/utils'
import { uploadImage } from '@/lib/upload'
import { toast } from 'sonner'
import ImageUploader from './ImageUploader'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS: Record<string,string> = {
  monday:'Lunes', tuesday:'Martes', wednesday:'Miércoles', thursday:'Jueves',
  friday:'Viernes', saturday:'Sábado', sunday:'Domingo',
}

interface Props {
  business?: Business
  galleryUrls?: string[]
}

export default function BusinessForm({ business, galleryUrls = [] }: Props) {
  const router  = useRouter()
  const supabase = createClient()
  const isEdit  = !!business

  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    name:              business?.name ?? '',
    category:          (business?.category ?? '') as Category | '',
    short_description: business?.short_description ?? '',
    description:       business?.description ?? '',
    phone:             business?.phone ?? '',
    whatsapp:          business?.whatsapp ?? '',
    website:           business?.website ?? '',
    instagram:         business?.instagram ?? '',
    email:             business?.email ?? '',
    address:           business?.address ?? '',
    latitude:          business?.latitude?.toString() ?? '-33.1833',
    longitude:         business?.longitude?.toString() ?? '-66.2167',
    cover_url:         business?.cover_url ?? '',
    logo_url:          business?.logo_url ?? '',
    is_featured:       business?.is_featured ?? false,
    is_verified:       business?.is_verified ?? false,
    status:            business?.status ?? 'activo',
  })
  const [schedule, setSchedule] = useState<Record<string,any>>(business?.schedule || {})
  const [gallery, setGallery]   = useState<string[]>(galleryUrls)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  // ── Galería: subir desde dispositivo ─────────────────────
  const handleGalleryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploadingGallery(true)
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f, 'business-images')))
      setGallery(p => [...p, ...urls])
      toast.success(`${urls.length} ${urls.length === 1 ? 'foto subida' : 'fotos subidas'}`)
    } catch (err: any) {
      toast.error(err.message || 'Error al subir fotos')
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category) { toast.error('Elegí una categoría'); return }
    if (!form.name.trim() || !form.address.trim()) { toast.error('Nombre y dirección son obligatorios'); return }

    setSaving(true)
    try {
      const payload: any = {
        name:              form.name.trim(),
        category:          form.category,
        short_description: form.short_description || null,
        description:       form.description || null,
        phone:             form.phone || null,
        whatsapp:          form.whatsapp || null,
        website:           form.website || null,
        instagram:         form.instagram?.replace('@','') || null,
        email:             form.email || null,
        address:           form.address.trim(),
        city:              'Potrero de los Funes',
        province:          'San Luis',
        latitude:          parseFloat(form.latitude),
        longitude:         parseFloat(form.longitude),
        cover_url:         form.cover_url || null,
        logo_url:          form.logo_url || null,
        is_featured:       form.is_featured,
        is_verified:       form.is_verified,
        status:            form.status,
        schedule:          Object.keys(schedule).length > 0 ? schedule : null,
        updated_at:        new Date().toISOString(),
      }

      let businessId = business?.id

      if (isEdit) {
        const { error } = await supabase.from('businesses').update(payload).eq('id', business!.id)
        if (error) throw error
      } else {
        payload.slug = generateSlug(form.name) + '-' + Date.now().toString(36)
        const { data, error } = await supabase.from('businesses').insert(payload).select('id').single()
        if (error) throw error
        businessId = data.id
      }

      if (businessId) {
        await supabase.from('business_media').delete().eq('business_id', businessId)
        if (gallery.length > 0) {
          await supabase.from('business_media').insert(
            gallery.map((url, idx) => ({ business_id: businessId, url, type: 'image', order_index: idx }))
          )
        }
      }

      toast.success(isEdit ? '¡Comercio actualizado!' : '¡Comercio creado!')
      router.push('/admin/comercios')
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="bg-white rounded-2xl p-4 shadow-card flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-sm">Estado del comercio</p>
          <p className="text-xs text-gray-400">Pausado = no aparece en la app (ej: cuota impaga)</p>
        </div>
        <div className="flex gap-2">
          {(['activo','pausado'] as const).map(s => (
            <button key={s} type="button" onClick={() => set('status', s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                form.status === s
                  ? s === 'activo' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
              {s === 'activo' ? 'Activo' : 'Pausado'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Información básica</h3>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Nombre del comercio *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Ej: La Costa Restaurante"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Categoría *</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.key} type="button" onClick={() => set('category', cat.key)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-semibold transition-all text-left ${
                  form.category === cat.key
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                }`}>
                <span className="text-lg">{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Descripción corta</label>
          <input value={form.short_description} onChange={e => set('short_description', e.target.value)}
            placeholder="Frase breve (máx. 100 caracteres)" maxLength={100}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Descripción completa</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Historia, especialidades, servicios..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)}
              className="w-4 h-4 rounded accent-brand-500" />
            ★ Destacado
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.is_verified} onChange={e => set('is_verified', e.target.checked)}
              className="w-4 h-4 rounded accent-brand-500" />
            ✓ Verificado
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Imágenes</h3>

        <ImageUploader
          label="Foto de portada"
          value={form.cover_url}
          onChange={v => set('cover_url', v)}
          bucket="business-images"
          aspectRatio="cover"
        />

        <ImageUploader
          label="Logo del comercio"
          value={form.logo_url}
          onChange={v => set('logo_url', v)}
          bucket="business-logos"
          aspectRatio="square"
        />

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
            Galería de fotos
          </label>

          {/* Fotos ya cargadas */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {gallery.map((url, i) => (
                <div key={i} className="relative h-20 rounded-xl overflow-hidden bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setGallery(p => p.filter((_,idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            id="gallery-upload"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryFile}
          />
          <label htmlFor="gallery-upload"
            className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors ${
              uploadingGallery ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
            }`}>
            {uploadingGallery ? (
              <>
                <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                <span className="text-xs font-bold text-brand-600">Subiendo fotos...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-brand-600">Agregar fotos a la galería</span>
              </>
            )}
          </label>
          <p className="text-[10px] text-gray-400 mt-1">Podés seleccionar varias fotos a la vez</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Contacto</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:'Teléfono',            key:'phone',     placeholder:'266 456-7890' },
            { label:'WhatsApp',            key:'whatsapp',  placeholder:'+5492664567890' },
            { label:'Instagram',           key:'instagram', placeholder:'@milocal' },
            { label:'Email del local',     key:'email',     placeholder:'local@email.com' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
              <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Sitio web</label>
          <input value={form.website} onChange={e => set('website', e.target.value)}
            placeholder="https://www.milocal.com.ar"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </div>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Ubicación</h3>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Dirección *</label>
          <input required value={form.address} onChange={e => set('address', e.target.value)}
            placeholder="Av. del Lago 450"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Latitud *</label>
            <input required value={form.latitude} onChange={e => set('latitude', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-brand-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Longitud *</label>
            <input required value={form.longitude} onChange={e => set('longitude', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-brand-400" />
          </div>
        </div>
        <button type="button"
          onClick={() => navigator.geolocation?.getCurrentPosition(p => {
            set('latitude', p.coords.latitude.toFixed(6))
            set('longitude', p.coords.longitude.toFixed(6))
            toast.success('Coordenadas obtenidas')
          })}
          className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 font-bold py-2.5 rounded-xl text-sm">
          <MapPin className="w-4 h-4" /> Usar mi ubicación actual
        </button>
        <p className="text-xs text-gray-400">
          💡 Google Maps → clic derecho → "¿Qué hay aquí?" para copiar las coordenadas exactas.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-card">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Horarios</h3>
        <div className="space-y-2.5">
          {DAYS.map(day => {
            const s    = schedule[day]
            const isSet = !!s
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="w-16 text-xs font-bold text-gray-500 flex-shrink-0">{DAY_LABELS[day].slice(0,3)}</span>
                <button type="button"
                  onClick={() => {
                    if (!isSet) setSchedule(p => ({ ...p, [day]: { open:'09:00', close:'18:00', closed:false } }))
                    else if (!s.closed) setSchedule(p => ({ ...p, [day]: { ...s, closed:true } }))
                    else { setSchedule(p => { const n={...p}; delete n[day]; return n }) }
                  }}
                  className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${isSet && !s.closed ? 'bg-brand-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isSet && !s.closed ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                {isSet && !s.closed ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={s.open} onChange={e => setSchedule(p => ({ ...p, [day]: { ...s, open:e.target.value } }))}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-brand-400" />
                    <span className="text-gray-400 text-xs">a</span>
                    <input type="time" value={s.close} onChange={e => setSchedule(p => ({ ...p, [day]: { ...s, close:e.target.value } }))}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-brand-400" />
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">{isSet && s.closed ? 'Cerrado' : 'Sin configurar'}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button type="submit" disabled={saving}
        className="w-full bg-brand-500 text-white font-display font-bold py-4 rounded-2xl shadow-brand flex items-center justify-center gap-2 disabled:opacity-60 text-base">
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
        {isEdit ? 'Guardar cambios' : 'Crear comercio'}
      </button>
    </form>
  )
}
