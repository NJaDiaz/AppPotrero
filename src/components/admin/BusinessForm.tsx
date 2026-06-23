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

interface Shift    { open: string; close: string }
interface DaySched { closed: boolean; shifts: Shift[] }

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS: Record<string,string> = {
  monday:'Lunes', tuesday:'Martes', wednesday:'Miércoles', thursday:'Jueves',
  friday:'Viernes', saturday:'Sábado', sunday:'Domingo',
}

function emptyDay(): DaySched { return { closed: false, shifts: [{ open:'09:00', close:'18:00' }] } }

// Redes sociales disponibles
const SOCIAL_OPTIONS = [
  { key: 'tiktok',    label: 'TikTok',    placeholder: '@milocal',           prefix: 'https://tiktok.com/@' },
  { key: 'facebook',  label: 'Facebook',  placeholder: 'milocal',            prefix: 'https://facebook.com/' },
  { key: 'youtube',   label: 'YouTube',   placeholder: '@micanal',           prefix: 'https://youtube.com/@' },
]

interface Props {
  business?: Business
  galleryUrls?: string[]
}

export default function BusinessForm({ business, galleryUrls = [] }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const isEdit   = !!business

  // Extraer redes extra del campo facebook existente (por si ya hay datos)
  const existingExtra: Record<string,string> = {}
  if ((business as any)?.tiktok)      existingExtra.tiktok      = (business as any).tiktok
  if ((business as any)?.youtube)     existingExtra.youtube     = (business as any).youtube

  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    name:              business?.name ?? '',
    category:          (business?.category ?? '') as Category | '',
    short_description: business?.short_description ?? '',
    description:       business?.description ?? '',
    // Contacto principal
    phone:             business?.phone ?? '',
    whatsapp:          business?.whatsapp ?? '',
    // Contacto secundario
    phone2:            (business as any)?.phone2 ?? '',
    whatsapp2:         (business as any)?.whatsapp2 ?? '',
    // Redes principales
    website:           business?.website ?? '',
    instagram:         business?.instagram ?? '',
    facebook:          business?.facebook ?? '',
    email:             business?.email ?? '',
    // Ubicación
    address:           business?.address ?? '',
    latitude:          business?.latitude?.toString() ?? '-33.1833',
    longitude:         business?.longitude?.toString() ?? '-66.2167',
    // Imágenes
    cover_url:         business?.cover_url ?? '',
    logo_url:          business?.logo_url ?? '',
    // Flags
    is_featured:       business?.is_featured ?? false,
    is_verified:       business?.is_verified ?? false,
    status:            business?.status ?? 'activo',
  })

  // Redes sociales extra (las que el admin activa)
  const [extraSocials, setExtraSocials] = useState<Record<string,string>>(existingExtra)
  // Qué redes extra están activadas
  const [activeSocials, setActiveSocials] = useState<string[]>(Object.keys(existingExtra))

  const [schedule, setSchedule]                   = useState<Record<string,DaySched>>(normalizeSchedule(business?.schedule))
  const [gallery, setGallery]                     = useState<string[]>(galleryUrls)
  const [uploadingGallery, setUploadingGallery]   = useState(false)
  const [showMoreContact, setShowMoreContact]     = useState(!!(  (business as any)?.phone2 || (business as any)?.whatsapp2))
  const [showMoreSocials, setShowMoreSocials]     = useState(false)

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  // ── Horarios ────────────────────────────────────────────────
  const toggleDay = (day: string) => {
    setSchedule(p => {
      if (!p[day]) return { ...p, [day]: emptyDay() }
      if (!p[day].closed) return { ...p, [day]: { closed: true, shifts: [] } }
      const n = { ...p }; delete n[day]; return n
    })
  }
  const setShift = (day: string, idx: number, field: 'open'|'close', val: string) => {
    setSchedule(p => {
      const shifts = [...(p[day]?.shifts || [])]
      shifts[idx] = { ...shifts[idx], [field]: val }
      return { ...p, [day]: { ...p[day], shifts } }
    })
  }
  const addShift = (day: string) => {
    setSchedule(p => ({
      ...p, [day]: { ...p[day], shifts: [...(p[day]?.shifts || []), { open:'15:00', close:'21:00' }] }
    }))
  }
  const removeShift = (day: string, idx: number) => {
    setSchedule(p => {
      const shifts = p[day].shifts.filter((_,i) => i !== idx)
      if (!shifts.length) { const n={...p}; delete n[day]; return n }
      return { ...p, [day]: { ...p[day], shifts } }
    })
  }

  // ── Redes extra ─────────────────────────────────────────────
  const toggleSocial = (key: string) => {
    setActiveSocials(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }
  const setSocial = (key: string, val: string) => {
    setExtraSocials(p => ({ ...p, [key]: val }))
  }

  // ── Galería ─────────────────────────────────────────────────
  const handleGalleryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingGallery(true)
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f, 'business-images')))
      setGallery(p => [...p, ...urls])
      toast.success(`${urls.length} ${urls.length === 1 ? 'foto subida' : 'fotos subidas'}`)
    } catch (err: any) {
      toast.error(err.message || 'Error al subir fotos')
    } finally {
      setUploadingGallery(false); e.target.value = ''
    }
  }

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category)                    { toast.error('Elegí una categoría'); return }
    if (!form.name.trim() || !form.address.trim()) { toast.error('Nombre y dirección son obligatorios'); return }

    setSaving(true)
    try {
      // Armar objeto de redes extra activas
      const socialsPayload: Record<string,string|null> = {}
      SOCIAL_OPTIONS.forEach(({ key }) => {
        socialsPayload[key] = activeSocials.includes(key) && extraSocials[key]?.trim()
          ? extraSocials[key].trim() : null
      })

      const payload: any = {
        name:              form.name.trim(),
        category:          form.category,
        short_description: form.short_description || null,
        description:       form.description || null,
        phone:             form.phone || null,
        whatsapp:          form.whatsapp || null,
        phone2:            form.phone2 || null,
        whatsapp2:         form.whatsapp2 || null,
        website:           form.website || null,
        instagram:         form.instagram?.replace('@','') || null,
        facebook:          form.facebook || null,
        email:             form.email || null,
        ...socialsPayload,
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

  // ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Estado */}
      <div className="bg-white rounded-2xl p-4 shadow-card flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-sm">Estado del comercio</p>
          <p className="text-xs text-gray-400">Pausado = no aparece en la app</p>
        </div>
        <div className="flex gap-2">
          {(['activo','pausado'] as const).map(s => (
            <button key={s} type="button" onClick={() => set('status', s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                form.status === s
                  ? s === 'activo' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {s === 'activo' ? '● Activo' : '⏸ Pausado'}
            </button>
          ))}
        </div>
      </div>

      {/* Info básica */}
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

        <div className="flex gap-4 pt-1">
          {[
            { key:'is_featured', label:'★ Destacado' },
            { key:'is_verified', label:'✓ Verificado' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => set(key, !(form as any)[key])}
                className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${(form as any)[key] ? 'bg-brand-500' : 'bg-gray-200'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${(form as any)[key] ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Imágenes</h3>

        <ImageUploader label="Foto de portada" value={form.cover_url}
          onChange={v => set('cover_url', v)} bucket="business-images" aspectRatio="cover" />

        <ImageUploader label="Logo del comercio" value={form.logo_url}
          onChange={v => set('logo_url', v)} bucket="business-logos" aspectRatio="square" />

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Galería de fotos</label>
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
          <input type="file" id="gallery-upload" accept="image/*" multiple className="hidden" onChange={handleGalleryFile} />
          <label htmlFor="gallery-upload"
            className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors ${
              uploadingGallery ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
            }`}>
            {uploadingGallery
              ? <><Loader2 className="w-4 h-4 text-brand-500 animate-spin" /><span className="text-xs font-bold text-brand-600">Subiendo...</span></>
              : <><Plus className="w-4 h-4 text-brand-500" /><span className="text-xs font-bold text-brand-600">Agregar fotos a la galería</span></>}
          </label>
        </div>
      </div>

      {/* ── CONTACTO ── */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Contacto</h3>

        {/* Principal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Teléfono</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="266 456-7890"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">WhatsApp</label>
            <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+5492664567890"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
            <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="local@email.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Sitio web</label>
            <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
        </div>

        {/* Contacto secundario — opcional */}
        {showMoreContact ? (
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Contacto secundario (opcional)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">2° Teléfono</label>
                <input value={form.phone2} onChange={e => set('phone2', e.target.value)} placeholder="266 456-0000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">2° WhatsApp</label>
                <input value={form.whatsapp2} onChange={e => set('whatsapp2', e.target.value)} placeholder="+5492664000000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
              </div>
            </div>
            <button type="button" onClick={() => { setShowMoreContact(false); set('phone2',''); set('whatsapp2','') }}
              className="text-xs text-red-400 font-semibold flex items-center gap-1">
              <X className="w-3 h-3" /> Quitar contacto secundario
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setShowMoreContact(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600">
            <Plus className="w-3.5 h-3.5" /> Agregar 2° teléfono / WhatsApp
          </button>
        )}
      </div>

      {/* ── REDES SOCIALES ── */}
      <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Redes sociales</h3>

        {/* Instagram y Facebook siempre visibles */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5 block">
              <span>📸</span> Instagram
            </label>
            <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@milocal"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5 block">
              <span>📘</span> Facebook
            </label>
            <input value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="milocal"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>
        </div>

        {/* Otras redes — activar con botón */}
        {activeSocials.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {activeSocials.map(key => {
              const opt = SOCIAL_OPTIONS.find(o => o.key === key)!
              return (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 mb-1 flex items-center justify-between">
                    <span>{opt.label}</span>
                    <button type="button" onClick={() => toggleSocial(key)}
                      className="text-red-400 hover:text-red-500 font-semibold flex items-center gap-0.5">
                      <X className="w-3 h-3" /> Quitar
                    </button>
                  </label>
                  <input
                    value={extraSocials[key] || ''}
                    onChange={e => setSocial(key, e.target.value)}
                    placeholder={opt.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Botones para activar más redes */}
        <div>
          <p className="text-xs text-gray-400 mb-2 font-semibold">Agregar otra red social:</p>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_OPTIONS.filter(o => !activeSocials.includes(o.key)).map(opt => (
              <button key={opt.key} type="button" onClick={() => toggleSocial(opt.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-600 text-gray-600 rounded-xl text-xs font-bold transition-colors">
                <Plus className="w-3 h-3" /> {opt.label}
              </button>
            ))}
          </div>
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
          {[{ label:'Latitud *', key:'latitude' },{ label:'Longitud *', key:'longitude' }].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
              <input required value={(form as any)[key]} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-brand-400" />
            </div>
          ))}
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
        <p className="text-xs text-gray-400">💡 Google Maps → clic derecho → "¿Qué hay aquí?" para las coordenadas exactas.</p>
      </div>

      {/* Horarios */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-1">Horarios</h3>
        <p className="text-xs text-gray-400 mb-4">Activá cada día y sumá turnos si es necesario (mañana y tarde)</p>
        <div className="space-y-3">
          {DAYS.map(day => {
            const d      = schedule[day]
            const isOn   = !!d && !d.closed
            const isClosed = !!d && d.closed
            return (
              <div key={day} className={`rounded-2xl border-2 transition-all ${isOn ? 'border-brand-200 bg-brand-50/40' : 'border-gray-100 bg-gray-50/60'}`}>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <span className="w-24 text-sm font-bold text-gray-700 flex-shrink-0">{DAY_LABELS[day]}</span>
                  <div className="flex gap-1.5 flex-1">
                    <button type="button" onClick={() => {
                        if (!d) setSchedule(p => ({ ...p, [day]: emptyDay() }))
                        else if (d.closed) setSchedule(p => ({ ...p, [day]: emptyDay() }))
                        else { const n={...schedule}; delete n[day]; setSchedule(n) }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isOn ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                      Abierto
                    </button>
                    <button type="button" onClick={() => {
                        if (!d || isOn) setSchedule(p => ({ ...p, [day]: { closed: true, shifts: [] } }))
                        else { const n={...schedule}; delete n[day]; setSchedule(n) }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isClosed ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                      Cerrado
                    </button>
                  </div>
                </div>
                {isOn && (
                  <div className="px-3 pb-3 space-y-2">
                    {d.shifts.map((shift, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 w-16 flex-shrink-0">
                          {idx === 0 ? '1° turno' : '2° turno'}
                        </span>
                        <input type="time" value={shift.open}
                          onChange={e => setShift(day, idx, 'open', e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-brand-400 bg-white" />
                        <span className="text-gray-400 text-xs">a</span>
                        <input type="time" value={shift.close}
                          onChange={e => setShift(day, idx, 'close', e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-brand-400 bg-white" />
                        {d.shifts.length > 1 && (
                          <button type="button" onClick={() => removeShift(day, idx)}
                            className="w-6 h-6 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 flex-shrink-0">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {d.shifts.length < 2 && (
                      <button type="button" onClick={() => addShift(day)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-brand-500 hover:text-brand-600 mt-1">
                        <Plus className="w-3 h-3" /> Agregar 2° turno (tarde)
                      </button>
                    )}
                  </div>
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

// ── Helper ──────────────────────────────────────────────────
function normalizeSchedule(raw: any): Record<string, DaySched> {
  if (!raw) return {}
  const result: Record<string, DaySched> = {}
  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  for (const day of DAYS) {
    if (!raw[day]) continue
    const d = raw[day]
    if (d.closed) { result[day] = { closed: true, shifts: [] }; continue }
    if (Array.isArray(d.shifts)) { result[day] = d; continue }
    if (d.open)   { result[day] = { closed: false, shifts: [{ open: d.open, close: d.close }] }; continue }
  }
  return result
}