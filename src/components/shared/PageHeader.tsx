
'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell } from 'lucide-react'
import Logo from './Logo'
import Link from 'next/link'

interface PageHeaderProps {
  title?: string         
  showBack?: boolean      
  backHref?: string       
  showNotif?: boolean    
  rightSlot?: React.ReactNode
}

export default function PageHeader({
  title,
  showBack = true,
  backHref,
  showNotif = false,
  rightSlot,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">

        {showBack ? (
          <button
            onClick={() => backHref ? router.push(backHref) : router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <Logo size="sm" href="/app" />
        )}

        <div className="flex-1">
          {title
            ? <h1 className="font-display font-bold text-gray-900 text-base">{title}</h1>
            : !showBack && null
          }
        </div>

        <div className="flex items-center gap-1">
          {rightSlot}
          {showNotif && (
            <Link href="/notificaciones"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
