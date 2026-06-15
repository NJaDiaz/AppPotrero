'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store, CalendarDays, Image as ImageIcon, Newspaper, MapPin,
  LogOut, TrendingUp, Eye, Pause, CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminHomePage() {
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({
    total: 0, activos: 0, pausados: 0, destacados: 0, visitas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    const [bizRes, statsRes] = await Promise.all([
      supabase.from('businesses').select('id,status,is_featured'),
      supabase.from('visit_stats').select('visits'),
    ])
    const biz = bizRes.data || []
    setStats({
      total:      biz.length,
      activos:    biz.filter(b => b.status === 'activo').length,
      pausados:   biz.filter(b => b.status === 'pausado').length,
      destacados: biz.filter(b => b.is_featured).length,
      visitas:    (statsRes.data || []).reduce((a, s) => a + (s.visits || 0), 0),
    })
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const sections = [
    { href: '/admin/comercios', label: 'Comercios',          desc: 'Crear, editar, pausar', icon: Store,       color: 'bg-brand-500' },
    { href: '/admin/eventos',   label: 'Eventos',            desc: 'Agenda de la ciudad',   icon: CalendarDays, color: 'bg-blue-500' },
    { href: '/admin/lugares',   label: 'Lugares para visitar', desc: 'Puntos turísticos',  icon: MapPin,       color: 'bg-emerald-500' },
    { href: '/admin/novedades', label: 'Novedades',          desc: 'Avisos e información', icon: Newspaper,    color: 'bg-pink-500' },
    { href: '/admin/banners',   label: 'Banners',            desc: 'Imágenes del inicio',  icon: ImageIcon,    color: 'bg-purple-500' },
  ]

  useEffect(() => {
  async function debug() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    console.log('ADMIN USER:', user)
  }

  debug()
  loadStats()
}, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img src="/logo-ccta.jpeg" alt="CCTA" className="w-9 h-9 rounded-xl object-contain" />
          <div className="flex-1">
            <h1 className="font-display font-black text-gray-900">Panel CCTA</h1>
            <p className="text-xs text-gray-400">Administración</p>
          </div>
          <button onClick={signOut} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Comercios',  value: stats.total,     icon: Store,       color: 'text-brand-500',   bg: 'bg-brand-50' },
            { label: 'Activos',    value: stats.activos,   icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Pausados',   value: stats.pausados,  icon: Pause,       color: 'text-amber-500',   bg: 'bg-amber-50' },
            { label: 'Visitas',    value: stats.visitas,   icon: Eye,         color: 'text-blue-500',    bg: 'bg-blue-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-card">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="font-display font-black text-2xl text-gray-900">{loading ? '—' : value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {sections.map(({ href, label, desc, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 card-hover">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>

        <Link href="/landing" className="block text-center text-sm text-gray-400 font-semibold py-2">
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  )
}
