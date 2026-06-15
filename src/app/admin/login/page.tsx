'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const router  = useRouter()
  const supabase = createClient()
  
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('LOGIN', { data, error })

  if (error || !data.user) {
    toast.error('Email o contraseña incorrectos')
    setLoading(false)
    return
  }

  toast.success('¡Bienvenido!')

  router.push('/admin')
  router.refresh()

  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-4 pt-4">
        <Link href="/landing" className="inline-flex items-center gap-2 text-gray-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al sitio
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <img src="/logo-ccta.jpeg" alt="CCTA" className="w-16 h-16 rounded-2xl object-contain mx-auto mb-4 shadow-brand" />
          <h1 className="font-display font-black text-2xl text-gray-900">Panel de administración</h1>
          <p className="text-gray-500 text-sm mt-1">CCTA Potrero de los Funes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@ccta.com" required
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-500 text-white font-display font-bold py-4 rounded-2xl text-sm shadow-brand hover:bg-brand-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
