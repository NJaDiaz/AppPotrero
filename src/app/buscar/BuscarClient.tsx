'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import BusinessCard from '@/components/business/BusinessCard'
import BottomNav from '@/components/shared/BottomNav'
import { CATEGORIES } from '@/types'
import type { Business, Category } from '@/types'

export default function BuscarPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Carga inicial + búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, category])

  async function search(q: string) {
    setLoading(true)

    let dbQuery = supabase
      .from('businesses')
      .select('*')
      .eq('status', 'activo')

    if (category !== 'all') {
      dbQuery = dbQuery.eq('category', category)
    }

    if (q.trim().length >= 2) {
      dbQuery = dbQuery.or(
        `name.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%,tags.cs.{${q}}`
      )
    }

    const { data } = await dbQuery
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30)

    setResults(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              showFilters
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
            <button
              onClick={() => setCategory('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                category === 'all'
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Todas
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                  category === cat.key
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                style={category === cat.key ? { background: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-2xl skeleton"
              />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-xs text-gray-400 font-semibold mb-3">
              {query.length >= 2
                ? `${results.length} resultados`
                : category !== 'all'
                ? `${results.length} comercios`
                : 'Todos los comercios'}
            </p>

            <div className="space-y-3">
              {results.map(b => (
                <BusinessCard
                  key={b.id}
                  business={b}
                  variant="horizontal"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-gray-600">
              Sin resultados
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Probá con otra búsqueda
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}