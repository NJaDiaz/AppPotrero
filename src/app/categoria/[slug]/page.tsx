'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BusinessCard from '@/components/business/BusinessCard'
import BottomNav from '@/components/shared/BottomNav'
import PageHeader from '@/components/shared/PageHeader'
import { CATEGORY_MAP } from '@/types'
import type { Business, Category } from '@/types'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const cat = CATEGORY_MAP[slug as Category]

  useEffect(() => {
    if (!slug) return
    supabase.from('businesses').select('*')
      .eq('status', 'activo').eq('category', slug)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBusinesses(data || []); setLoading(false) })
  }, [slug])

  if (!cat) return <div className="min-h-screen flex items-center justify-center text-gray-400">Categoría no encontrada</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title={cat.label} backHref="/app" />

      {/* Header con color de categoría */}
      <div className="px-4 py-6" style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)` }}>
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
            {cat.icon}
          </div>
          <div>
            <h1 className="font-display font-black text-white text-2xl">{cat.label}</h1>
            <p className="text-white/70 text-sm">{businesses.length} {businesses.length === 1 ? 'comercio' : 'comercios'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-3 space-y-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl skeleton" />)
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card mt-4">
            <span className="text-5xl">{cat.icon}</span>
            <h3 className="font-bold text-gray-600 mt-3 mb-1">Sin comercios aún</h3>
            <p className="text-sm text-gray-400">No hay comercios en esta categoría todavía</p>
          </div>
        ) : (
          businesses.map(b => <BusinessCard key={b.id} business={b} variant="horizontal" />)
        )}
      </div>

      <BottomNav />
    </div>
  )
}
