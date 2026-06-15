'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import nextDynamic from 'next/dynamic'
import { Search, X, SlidersHorizontal, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import BusinessMapSheet from '@/components/map/BusinessMapSheet'
import BottomNav from '@/components/shared/BottomNav'
import Logo from '@/components/shared/Logo'
import { CATEGORIES } from '@/types'
import type { Business, Category } from '@/types'

const InteractiveMap = nextDynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm font-medium">Cargando mapa...</span>
      </div>
    </div>
  ),
})

export default function MapPage() {
  const [businesses, setBusinesses]           = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [activeCategory, setActiveCategory]   = useState<Category | 'all'>('all')
  const [searchQuery, setSearchQuery]         = useState('')
  const [loading, setLoading]                 = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const sheetRef     = useRef<HTMLDivElement>(null)
  const dragStart    = useRef<number>(0)
  const dragging     = useRef(false)

  const supabase = createClient()

  useEffect(() => { loadBusinesses() }, [activeCategory])

  async function loadBusinesses() {
    setLoading(true)
    let q = supabase.from('businesses').select('*').eq('status', 'activo')
    if (activeCategory !== 'all') q = q.eq('category', activeCategory)
    const { data } = await q
    setBusinesses(data || [])
    setLoading(false)
  }

  const filtered = searchQuery
    ? businesses.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase()))
    : businesses

  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY
    dragging.current  = true
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return
    const delta = e.touches[0].clientY - dragStart.current
    if (delta > 0) {
      sheetRef.current.style.transform = `translateY(${delta}px)`
      sheetRef.current.style.transition = 'none'
    }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    dragging.current = false
    if (!sheetRef.current) return
    const delta = e.changedTouches[0].clientY - dragStart.current
    if (delta > 80) {
      sheetRef.current.style.transition = 'transform 0.25s ease'
      sheetRef.current.style.transform  = 'translateY(100%)'
      setTimeout(() => {
        setSelectedBusiness(null)
        if (sheetRef.current) { sheetRef.current.style.transform = ''; sheetRef.current.style.transition = '' }
      }, 250)
    } else {
      sheetRef.current.style.transition = 'transform 0.2s ease'
      sheetRef.current.style.transform  = ''
    }
  }

  const activeCatInfo = CATEGORIES.find(c => c.key === activeCategory)

  return (
    <div className="fixed inset-0 flex flex-col bg-white">

      <div className="bg-white/95 backdrop-blur-md shadow-sm z-[500] relative">
        <div className="bg-white/95 backdrop-blur-md shadow-sm z-[500] relative">
  <div className="max-w-lg mx-auto px-3 py-2.5 space-y-2">

    <div className="flex items-center justify-between">
      <Logo size="sm" href="/" />

      <button
        onClick={() => setShowFilterModal(true)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          activeCategory !== 'all'
            ? 'bg-brand-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>
          {activeCategory !== 'all'
            ? activeCatInfo?.label
            : 'Filtrar'}
        </span>
      </button>
    </div>

    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar comercios..."
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />

      {searchQuery && (
        <button onClick={() => setSearchQuery('')}>
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>

  </div>
</div>

        {activeCategory !== 'all' && activeCatInfo && (
          <div className="px-3 pb-2 flex gap-2 max-w-lg mx-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: activeCatInfo.color }}
            >
              {activeCatInfo.icon} {activeCatInfo.label}
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <InteractiveMap
          businesses={filtered}
          selectedId={selectedBusiness?.id}
          onSelectBusiness={setSelectedBusiness}
          height="100%"
        />

        {!loading && (
          <div className="absolute bottom-4 left-3 z-[400]">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card text-xs font-bold text-gray-700 border border-gray-100">
              {filtered.length} {filtered.length === 1 ? 'comercio' : 'comercios'}
            </div>
          </div>
        )}

        {selectedBusiness && (
          <div
            ref={sheetRef}
            className="absolute bottom-0 left-0 right-0 z-[600] bg-white rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.16)] max-h-[62vh] overflow-y-auto animate-slide-up"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <BusinessMapSheet
              business={selectedBusiness}
              onClose={() => setSelectedBusiness(null)}
            />
          </div>
        )}
      </div>

      <BottomNav />

      {showFilterModal && (
        <div className="fixed inset-0 z-[700] flex items-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilterModal(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))' }}>

            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-4 pb-2 flex items-center justify-between">
              <h2 className="font-display font-bold text-gray-900 text-lg">Filtrar categoría</h2>
              <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-2">
              <button
                onClick={() => { setActiveCategory('all'); setShowFilterModal(false) }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
                  activeCategory === 'all'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">🗺️</div>
                  <span className="font-bold text-gray-900">Todos los comercios</span>
                </div>
                {activeCategory === 'all' && <Check className="w-5 h-5 text-brand-500" />}
              </button>

              {CATEGORIES.map(cat => {
                const count  = businesses.filter(b => b.category === cat.key).length
                const active = activeCategory === cat.key
                return (
                  <button
                    key={cat.key}
                    onClick={() => { setActiveCategory(cat.key); setShowFilterModal(false) }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
                      active ? 'border-brand-500 bg-brand-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: cat.bgColor }}>
                        {cat.icon}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-gray-900 block">{cat.label}</span>
                        <span className="text-xs text-gray-400">{count} {count === 1 ? 'comercio' : 'comercios'}</span>
                      </div>
                    </div>
                    {active
                      ? <Check className="w-5 h-5 text-brand-500 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    }
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
