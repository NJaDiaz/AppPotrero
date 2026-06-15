'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/shared/BottomNav'
import PageHeader from '@/components/shared/PageHeader'
import { timeAgo } from '@/lib/utils'
import type { News } from '@/types'

export default function NovedadesPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('news').select('*').eq('is_active', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => { setNews(data || []); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="Novedades" backHref="/app" />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl skeleton" />)
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-gray-600">Sin novedades</h3>
            <p className="text-sm text-gray-400 mt-1">Pronto vas a ver información acá</p>
          </div>
        ) : (
          news.map(n => {
            const content = (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden card-hover">
                {n.image_url && (
                  <div className="relative h-40">
                    <Image src={n.image_url} alt={n.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{n.body}</p>
                  <p className="text-xs text-gray-300 mt-2">{timeAgo(n.published_at)}</p>
                </div>
              </div>
            )
            return n.link_url ? (
              <Link key={n.id} href={n.link_url}>{content}</Link>
            ) : (
              <div key={n.id}>{content}</div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}
