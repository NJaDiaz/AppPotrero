import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BusinessPageClient from './BusinessPageClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: business } = await supabase
    .from('businesses').select('name, short_description, cover_url').eq('slug', params.slug).single()
  if (!business) return { title: 'Comercio no encontrado' }
  return {
    title: business.name,
    description: business.short_description || `Visitá ${business.name} en Potrero de los Funes`,
    openGraph: { title: business.name, description: business.short_description || '', images: business.cover_url ? [business.cover_url] : [] },
  }
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: business } = await supabase.from('businesses').select('*').eq('slug', params.slug).single()
  if (!business) notFound()

  const { data: media } = await supabase.from('business_media').select('*').eq('business_id', business.id).order('order_index')

  supabase.rpc('record_business_visit', { p_business_id: business.id, p_action: 'visit' })

  return <BusinessPageClient business={business} media={media || []} />
}
