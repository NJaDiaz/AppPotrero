import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function AppHome() {
  const supabase = createClient()
  const [bizRes, eventsRes, bannersRes, placesRes] = await Promise.all([
    supabase.from('businesses').select('*').eq('status','activo')
      .order('is_featured',{ascending:false}).order('created_at',{ascending:false}).limit(20),
    supabase.from('events').select('*').eq('is_active',true)
      .gte('starts_at', new Date().toISOString()).order('starts_at',{ascending:true}).limit(5),
    supabase.from('banners').select('*').eq('is_active',true).order('order_index',{ascending:true}),
    supabase.from('places').select('*').eq('is_active',true)
      .order('is_featured',{ascending:false}).order('order_index',{ascending:true}).limit(8),
  ])
  return (
    <HomeClient
      businesses={bizRes.data || []}
      events={eventsRes.data || []}
      banners={bannersRes.data || []}
      places={placesRes.data || []}
    />
  )
}
