'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Star, MapPin, Pause, Play, Trash2, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_MAP } from '@/types'
import { toast } from 'sonner'
import type { Business, BusinessStatus, Category } from '@/types'

export default function AdminComerciosListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<BusinessStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false })
    setBusinesses(data || [])
    setLoading(false)
  }

  const toggleStatus = async (b: Business) => {
    const next: BusinessStatus = b.status === 'activo' ? 'pausado' : 'activo'
    await supabase.from('businesses').update({ status: next }).eq('id', b.id)
    setBusinesses(prev => prev.map(x => x.id === b.id ? { ...x, status: next } : x))
    toast.success(next === 'activo' ? 'Comercio activado' : 'Comercio pausado')
  }

  const remove = async (b: Business) => {
    if (!confirm(`¿Eliminar "${b.name}"? Esta acción no se puede deshacer.`)) return
    await supabase.from('businesses').delete().eq('id', b.id)
    setBusinesses(prev => prev.filter(x => x.id !== b.id))
    toast.success('Comercio eliminado')
  }

  const filtered = businesses.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.address.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-display font-bold text-gray-900">Comercios</h1>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-lg">{filtered.length}</span>
            </div>
            <Link href="/admin/comercios/nuevo"
              className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-sm px-3 py-2 rounded-xl shadow-brand">
              <Plus className="w-4 h-4" /> Nuevo
            </Link>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
                className="w-full bg-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value as any)}
              className="bg-gray-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none">
              <option value="all">Todos</option>
              <option value="activo">Activos</option>
              <option value="pausado">Pausados</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl skeleton" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Sin resultados</p>
          </div>
        ) : (
          filtered.map(biz => {
            const cat = CATEGORY_MAP[biz.category as Category]
            return (
              <div key={biz.id} className={`bg-white rounded-2xl p-4 shadow-card ${biz.status === 'pausado' ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  {biz.logo_url ? (
                    <img src={biz.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: cat?.bgColor }}>
                      {cat?.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        {biz.name}
                        {biz.is_featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${biz.status === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {biz.status === 'activo' ? 'Activo' : 'Pausado'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: cat?.color }}>{cat?.label}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-400 truncate">{biz.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/comercios/${biz.id}`}
                    className="flex-1 bg-brand-50 text-brand-600 font-bold py-2 rounded-xl text-xs text-center">
                    Editar
                  </Link>
                  <button onClick={() => toggleStatus(biz)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold ${biz.status === 'activo' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {biz.status === 'activo' ? <><Pause className="w-3.5 h-3.5" /> Pausar</> : <><Play className="w-3.5 h-3.5" /> Activar</>}
                  </button>
                  <Link href={`/comercio/${biz.slug}`} target="_blank"
                    className="flex-1 bg-gray-50 text-gray-600 font-bold py-2 rounded-xl text-xs text-center">
                    Ver →
                  </Link>
                  <button onClick={() => remove(biz)}
                    className="px-3 bg-red-50 text-red-500 rounded-xl">
                    <Trash2 className="w-4 h-4" />
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
