'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, Newspaper, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/app', icon: Home, label: 'Inicio' },
  { href: '/mapa', icon: Map, label: 'Mapa' },
  { href: '/eventos', icon: CalendarDays, label: 'Eventos' },
  { href: '/novedades', icon: Newspaper, label: 'Novedades' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
      style={{
        paddingBottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto max-w-lg px-4">

        <div className="pointer-events-auto rounded-[28px] border border-white/60 bg-white/90 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">

          <div className="flex items-center justify-around px-2 py-3">

            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname === href

              return (
                <Link
                  key={href}
                  href={href}
                  className="group flex min-w-[72px] flex-col items-center"
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
                      active
                        ? 'bg-brand-500 shadow-lg shadow-brand-500/30 scale-105'
                        : 'bg-transparent group-hover:bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6 transition-all duration-300',
                        active
                          ? 'text-white'
                          : 'text-gray-500 group-hover:text-brand-500'
                      )}
                      strokeWidth={active ? 2.4 : 2}
                    />
                  </div>

                  <span
                    className={cn(
                      'mt-2 text-[11px] font-semibold transition-all duration-300',
                      active
                        ? 'text-brand-500'
                        : 'text-gray-500 group-hover:text-brand-500'
                    )}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}

          </div>

        </div>

      </div>
    </nav>
  )
}