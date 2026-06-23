

export type UserRole = 'admin' 

export type BusinessStatus = 'activo' | 'pausado'

export type Category =
  | 'gastronomia'
  | 'turismo'
  | 'salud'
  | 'comercios'
  | 'servicios'
  | 'deportes'
  | 'entretenimiento'
  | 'alojamiento'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category: Category
  subcategory: string | null
  status: BusinessStatus
  is_featured: boolean
  is_verified: boolean
  logo_url: string | null
  cover_url: string | null
  address: string
  city: string
  province: string
  latitude: number
  longitude: number
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  view_count: number
  schedule: BusinessSchedule | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Shift {
  open: string
  close: string
}

export interface DaySchedule {
  closed: boolean
  shifts: Shift[]
}

export interface BusinessSchedule {
  monday: DaySchedule | null
  tuesday: DaySchedule | null
  wednesday: DaySchedule | null
  thursday: DaySchedule | null
  friday: DaySchedule | null
  saturday: DaySchedule | null
  sunday: DaySchedule | null
}

export interface BusinessMedia {
  id: string
  business_id: string
  url: string
  type: 'image' | 'video'
  caption: string | null
  order_index: number
  created_at: string
}

export interface News {
  id: string
  title: string
  body: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
  published_at: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  image_url: string | null
  location: string
  latitude: number | null
  longitude: number | null
  starts_at: string
  ends_at: string | null
  price: number | null
  is_free: boolean
  is_active: boolean
  created_at: string
}

export interface Place {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  image_url: string | null
  gallery: string[]
  latitude: number
  longitude: number
  category: string | null   
  is_featured: boolean
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface VisitStat {
  id: string
  business_id: string
  date: string
  visits: number
  whatsapp_clicks: number
  calls: number
  map_views: number
}

export interface CategoryInfo {
  key: Category
  label: string
  icon: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'gastronomia',     label: 'Gastronomía',     icon: '🍽️', color: '#f97316', bgColor: '#fff7ed' },
  { key: 'turismo',         label: 'Turismo',         icon: '📸', color: '#059669', bgColor: '#ecfdf5' },
  { key: 'salud',           label: 'Salud',           icon: '💙', color: '#2563eb', bgColor: '#eff6ff' },
  { key: 'comercios',       label: 'Comercios',       icon: '🛍️', color: '#d97706', bgColor: '#fffbeb' },
  { key: 'servicios',       label: 'Servicios',       icon: '🔧', color: '#ea580c', bgColor: '#fff7ed' },
  { key: 'deportes',        label: 'Deportes',        icon: '🏋️', color: '#0891b2', bgColor: '#ecfeff' },
  { key: 'entretenimiento', label: 'Entretenimiento', icon: '🎭', color: '#be185d', bgColor: '#fdf2f8' },
  { key: 'alojamiento',     label: 'Alojamiento',     icon: '🏨', color: '#7c3aed', bgColor: '#f5f3ff' },
]

export const CATEGORY_MAP: Record<Category, CategoryInfo> = CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat.key]: cat }),
  {} as Record<Category, CategoryInfo>
)
