'use client'
import { useEffect, useRef } from 'react'
import { Crosshair } from 'lucide-react'
import type { Business } from '@/types'
import { CATEGORY_MAP } from '@/types'

interface Props {
  businesses: Business[]
  selectedId?: string | null
  onSelectBusiness?: (b: Business | null) => void
  height?: string
  center?: [number, number]
  zoom?: number
}

const DEFAULT_CENTER: [number, number] = [-33.225035625313474, -66.22958247098268]
const DEFAULT_ZOOM = 15

const CAT_COLORS: Record<string, string> = {
  gastronomia:     '#f97316',
  turismo:         '#059669',
  salud:           '#2563eb',
  comercios:       '#d97706',
  servicios:       '#ea580c',
  deportes:        '#0891b2',
  entretenimiento: '#be185d',
  alojamiento:     '#7c3aed',
}


function buildIcon(L: any, biz: Business, selected: boolean) {
  const color = CAT_COLORS[biz.category] || '#f97316'
  const cat   = CATEGORY_MAP[biz.category]
  const emoji = cat?.icon || '📍'
  const scale = selected ? 1.18 : 1

 
  const label = biz.name.length > 20 ? biz.name.slice(0, 18) + '…' : biz.name


  const innerContent = biz.cover_url
    ? `<image href="${biz.cover_url}" x="4" y="4" width="44" height="44"
         clip-path="url(#imgClip)" preserveAspectRatio="xMidYMid slice"
         style="border-radius:50%"/>`
    : `<text x="26" y="30" text-anchor="middle" dominant-baseline="middle"
         font-size="22">${emoji}</text>`


  const labelW  = Math.max(60, label.length * 6.5 + 20)
  const totalW  = Math.max(labelW, 52) + 4
  const totalH  = 80

  const svg = `
<svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="imgClip">
      <circle cx="26" cy="26" r="22"/>
    </clipPath>
    <filter id="pin-shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="${selected ? 5 : 3}" stdDeviation="${selected ? 5 : 3}"
        flood-color="${color}" flood-opacity="${selected ? 0.45 : 0.30}"/>
    </filter>
  </defs>

  <!-- Círculo principal -->
  <circle cx="26" cy="26" r="24"
    fill="${color}" filter="url(#pin-shadow)"
    ${selected ? `stroke="white" stroke-width="3"` : ''}/>

  <!-- Borde interior claro para contraste -->
  <circle cx="26" cy="26" r="21.5" fill="white" fill-opacity="0.18"/>

  <!-- Imagen o emoji -->
  ${innerContent}

  <!-- Estrella destacado -->
  ${biz.is_featured ? `
    <circle cx="${totalW - 8}" cy="8" r="8" fill="#f59e0b"/>
    <text x="${totalW - 8}" y="8" text-anchor="middle" dominant-baseline="middle"
      font-size="9" fill="white">★</text>
  ` : ''}

  <!-- Punta del pin -->
  <polygon points="${totalW/2 - 5},47 ${totalW/2 + 5},47 ${totalW/2},58"
    fill="${color}" filter="url(#pin-shadow)"/>

  <!-- Etiqueta con nombre -->
  <rect x="${(totalW - labelW) / 2}" y="61"
    width="${labelW}" height="17" rx="8.5" ry="8.5"
    fill="${color}" fill-opacity="0.92"/>
  <text x="${totalW / 2}" y="69.5"
    text-anchor="middle" dominant-baseline="middle"
    font-family="Nunito, system-ui, sans-serif" font-weight="800"
    font-size="9.5" fill="white">
    ${label}
  </text>
</svg>`

  return L.divIcon({
    html: `<div style="transform:scale(${scale});transform-origin:bottom center;
                       transition:transform 0.2s ease">${svg}</div>`,
    className:  'custom-map-marker',
    iconSize:   [totalW, totalH],
    iconAnchor: [totalW / 2, totalH - 2],
  })
}

export default function InteractiveMap({
  businesses,
  selectedId,
  onSelectBusiness,
  height = '100%',
  center = DEFAULT_CENTER,
  zoom   = DEFAULT_ZOOM,
}: Props) {
  const mapRef     = useRef<HTMLDivElement>(null)
  const mapInst    = useRef<any>(null)
  const markers    = useRef<Map<string, any>>(new Map())
  const userMarker = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInst.current) return
    const L = require('leaflet')

    const map = L.map(mapRef.current, {
      center, zoom,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { attribution: '© OpenStreetMap © CartoDB', maxZoom: 19 }
    ).addTo(map)

    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    map.on('click', () => onSelectBusiness?.(null))

    mapInst.current = map
    return () => { map.remove(); mapInst.current = null }
  }, [])

  useEffect(() => {
    if (!mapInst.current) return
    const L = require('leaflet')

    markers.current.forEach((marker, id) => {
      if (!businesses.find(b => b.id === id)) {
        marker.remove(); markers.current.delete(id)
      }
    })

    businesses.forEach(biz => {
      if (markers.current.has(biz.id)) return
      const marker = L.marker(
        [biz.latitude, biz.longitude],
        { icon: buildIcon(L, biz, biz.id === selectedId), zIndexOffset: biz.id === selectedId ? 1000 : 0 }
      )
      marker.on('click', (e: any) => {
        e.originalEvent?.stopPropagation()
        onSelectBusiness?.(biz)
      })
      marker.addTo(mapInst.current)
      markers.current.set(biz.id, marker)
    })
  }, [businesses])

  useEffect(() => {
    if (!mapInst.current) return
    const L = require('leaflet')

    markers.current.forEach((marker, id) => {
      const biz = businesses.find(b => b.id === id)
      if (!biz) return
      const sel = id === selectedId
      marker.setIcon(buildIcon(L, biz, sel))
      marker.setZIndexOffset(sel ? 1000 : 0)
    })

    if (selectedId) {
      const biz = businesses.find(b => b.id === selectedId)
      if (biz) mapInst.current.panTo([biz.latitude, biz.longitude], { animate: true, duration: 0.4 })
    }
  }, [selectedId, businesses])

  const locateUser = () => {
    if (!mapInst.current) return
    const L = require('leaflet')
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      const icon = L.divIcon({
        html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;
                           border-radius:50%;box-shadow:0 0 0 5px rgba(59,130,246,0.22)"></div>`,
        className: '', iconSize: [18, 18], iconAnchor: [9, 9],
      })
      if (userMarker.current) userMarker.current.setLatLng([latitude, longitude])
      else userMarker.current = L.marker([latitude, longitude], { icon, zIndexOffset: 2000 }).addTo(mapInst.current)
      mapInst.current.flyTo([latitude, longitude], 15, { animate: true, duration: 1 })
    }, () => {}, { enableHighAccuracy: true })
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={locateUser}
        className="absolute right-3 top-3 z-[400] w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
        title="Mi ubicación"
      >
        <Crosshair className="w-5 h-5" />
      </button>
    </div>
  )
}
