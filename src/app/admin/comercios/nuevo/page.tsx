'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BusinessForm from '@/components/admin/BusinessForm'

export default function NuevoComercioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link href="/admin/comercios" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-gray-900">Nuevo comercio</h1>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-5">
        <BusinessForm />
      </div>
    </div>
  )
}
