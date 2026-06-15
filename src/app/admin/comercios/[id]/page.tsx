'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import BusinessForm from '@/components/admin/BusinessForm'
import type { Business } from '@/types'

export default function EditarComercioPage() {
  const { id } = useParams<{ id: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [gallery, setGallery]   = useState<string[]>([])
  const [loading, setLoading]   = useState(true)
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('businesses').select('*').eq('id', id).single(),
      supabase.from('business_media').select('url').eq('business_id', id).order('order_index'),
    ]).then(([bizRes, mediaRes]) => {
      setBusiness(bizRes.data)
      setGallery((mediaRes.data || []).map(m => m.url))
      setLoading(false)
    })
  }, [id])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link href="/admin/comercios" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-gray-900">{business?.name || 'Editar comercio'}</h1>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : business ? (
          <BusinessForm business={business} galleryUrls={gallery} />
        ) : (
          <p className="text-center text-gray-400 py-20">Comercio no encontrado</p>
        )}
      </div>
    </div>
  )
}
