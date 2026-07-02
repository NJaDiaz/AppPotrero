'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn, isBusinessOpen } from '@/lib/utils'
import { CATEGORY_MAP } from '@/types'
import type { Business } from '@/types'

interface BusinessCardProps {
  business: Business
  variant?: 'default' | 'horizontal' | 'featured'
  className?: string
}

export default function BusinessCard({ business, variant = 'default', className }: BusinessCardProps) {
  const category = CATEGORY_MAP[business.category]
  const isOpen = isBusinessOpen(business.schedule)
  const hasSchedule = !!business.schedule

  const OpenBadge = () => hasSchedule ? (
    <span className={cn('text-xs font-semibold', isOpen ? 'text-emerald-600' : 'text-red-500')}>
      ● {isOpen ? 'Abierto' : 'Cerrado'}
    </span>
  ) : null

  if (variant === 'horizontal') {
    return (
      <Link href={`/comercio/${business.slug}`}>
        <div className={cn('flex gap-3 my-2 bg-white rounded-2xl p-3 shadow-card card-hover', className)}>
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {business.cover_url ? (
              <Image src={business.cover_url} alt={business.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: category?.bgColor }}>
                {category?.icon}
              </div>
            )}
            {business.is_featured && (
              <div className="absolute top-1 left-1 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                ★ TOP
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{business.name}</h3>
              {business.is_verified && <span className="text-brand-500 flex-shrink-0">✓</span>}
            </div>
            <div className="flex items-center gap-1 mt-0.5 mb-1">
              <span className="text-xs font-medium" style={{ color: category?.color }}>{category?.label}</span>
              {hasSchedule && <span className="text-gray-300 text-xs">·</span>}
              <OpenBadge />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 truncate">{business.address}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/comercio/${business.slug}`}>
        <div className={cn('relative w-56 rounded-2xl overflow-hidden shadow-card card-hover bg-white', className)}>
          <div className="relative h-36 bg-gray-100">
            {business.cover_url ? (
              <Image src={business.cover_url} alt={business.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-brand-50">
                {category?.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {business.is_featured && (
              <div className="absolute top-2 left-2 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                ☆ Destacado
              </div>
            )}
            {business.logo_url && (
              <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full overflow-hidden bg-white border-2 border-white shadow">
                <Image src={business.logo_url} alt={business.name} fill className="object-cover" />
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-bold text-gray-900 text-sm truncate">{business.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-medium" style={{ color: category?.color }}>{category?.label}</span>
              <OpenBadge />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/comercio/${business.slug}`}>
      <div className={cn('bg-white rounded-2xl overflow-hidden shadow-card card-hover', className)}>
        <div className="relative h-40 bg-gray-100">
          {business.cover_url ? (
            <Image src={business.cover_url} alt={business.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: category?.bgColor }}>
              {category?.icon}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {business.is_featured && (
            <div className="absolute top-2 left-2 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">
              ☆ Destacado
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-gray-900 text-sm">{business.name}</h3>
            {business.is_verified && <span className="text-brand-500 text-xs">✓</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium" style={{ color: category?.color }}>{category?.label}</span>
            <OpenBadge />
          </div>
        </div>
      </div>
    </Link>
  )
}
