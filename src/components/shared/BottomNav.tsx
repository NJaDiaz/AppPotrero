'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, Newspaper, CalendarDays, MapPinned } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/app',      icon: Home,         label: 'Inicio' },
  { href: '/mapa',     icon: Map,          label: 'Mapa' },
  { href: '/eventos',  icon: CalendarDays, label: 'Eventos' },
  { href: '/novedades',icon: Newspaper,    label: 'Novedades' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around px-2 pt-2 max-w-lg mx-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px]">
              <Icon className={cn('w-6 h-6 transition-colors',
                active ? 'text-brand-500' : 'text-gray-400')}
                strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn('text-[10px] font-semibold transition-colors',
                active ? 'text-brand-500' : 'text-gray-400')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
