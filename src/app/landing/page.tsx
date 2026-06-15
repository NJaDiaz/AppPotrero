import { createClient } from '@/lib/supabase/server'
import LandingClient from './LandingClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CCTA – Cámara de Comercio, Turismo y Afines | Potrero de los Funes',
  description: 'Comercios, restaurantes, turismo, servicios de Potrero de los Funes, San Luis, Argentina.',
}

export default async function LandingPage() {
  const supabase = createClient()
  const [bizRes, eventsRes, statsRes, placesRes] = await Promise.all([
    supabase.from('businesses').select('*').eq('status', 'activo')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }).limit(12),
    supabase.from('events').select('*').eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }).limit(4),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'activo'),
    supabase.from('places').select('*').eq('is_active', true)
      .order('is_featured', { ascending: false }).order('order_index').limit(8),
  ])
  return (
    <LandingClient
      businesses={bizRes.data || []}
      events={eventsRes.data || []}
      totalBusinesses={statsRes.count || 0}
      places={placesRes.data || []}
    />
  )
}
