import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { BusinessSchedule } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2-$3')
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '')
  const text  = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${clean}${text ? `?text=${text}` : ''}`
}

export function isBusinessOpen(schedule: BusinessSchedule | null): boolean {
  if (!schedule) return false

  const now = new Date()

  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const

  const today = days[now.getDay()]
  const daySchedule = schedule[today]

  if (!daySchedule || daySchedule.closed || !daySchedule.shifts?.length) {
    return false
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return daySchedule.shifts.some((shift) => {
    const [openH, openM] = shift.open.split(':').map(Number)
    const [closeH, closeM] = shift.close.split(':').map(Number)

    const open = openH * 60 + openM
    const close = closeH * 60 + closeM

    // horario que cruza medianoche
    if (close < open) {
      return currentMinutes >= open || currentMinutes <= close
    }

    return currentMinutes >= open && currentMinutes <= close
  })
}

export function formatDaySchedule(
  schedule: BusinessSchedule | null,
  day: keyof BusinessSchedule
): string {
  const daySchedule = schedule?.[day]

  if (!daySchedule || daySchedule.closed) {
    return 'Cerrado'
  }

  return daySchedule.shifts
    .map((shift) => `${shift.open} - ${shift.close}`)
    .join(' | ')
}


export function getScheduleText(schedule: BusinessSchedule | null): string {
  if (!schedule) return 'Horario no disponible'

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const

  const openDays = days.filter(
    (d) =>
      schedule[d] &&
      !schedule[d]!.closed &&
      schedule[d]!.shifts?.length > 0
  )

  if (openDays.length === 0) {
    return 'Cerrado'
  }

  if (openDays.length === 7) {
    const monday = schedule.monday

    if (
      monday &&
      !monday.closed &&
      monday.shifts?.length
    ) {
      return `Lun a Dom ${monday.shifts
        .map((s) => `${s.open}-${s.close}`)
        .join(' | ')} hs`
    }
  }

  return 'Ver horario completo'
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date))    return `Hoy a las ${format(date, 'HH:mm')}`
  if (isTomorrow(date)) return `Mañana a las ${format(date, 'HH:mm')}`
  return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es })
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: es })
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}


export function getDirectionsUrl(lat: number, lng: number, label?: string): string {
  const encodedLabel = label ? encodeURIComponent(label) : ''
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1)
    if (isIOS) {
      return `https://maps.apple.com/?daddr=${lat},${lng}${encodedLabel ? `&q=${encodedLabel}` : ''}`
    }
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
