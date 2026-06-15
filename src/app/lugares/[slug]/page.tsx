// src/app/lugares/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PlaceDetailClient from './PlaceDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: place } = await supabase.from('places').select('name, short_description, image_url').eq('slug', params.slug).single()
  if (!place) return { title: 'Lugar no encontrado' }
  return {
    title: place.name,
    description: place.short_description || `Descubrí ${place.name} en Potrero de los Funes`,
    openGraph: { images: place.image_url ? [place.image_url] : [] },
  }
}

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: place } = await supabase.from('places').select('*').eq('slug', params.slug).eq('is_active', true).single()
  if (!place) notFound()
  return <PlaceDetailClient place={place} />
}
