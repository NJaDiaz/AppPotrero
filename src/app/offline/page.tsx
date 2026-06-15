export const dynamic = 'force-static'
export const revalidate = false

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <img src="/logo-ccta.jpeg" alt="CCTA" className="w-16 h-16 rounded-2xl object-contain mx-auto mb-6" />
        <div className="text-5xl mb-4">📵</div>
        <h1 className="font-display font-black text-2xl text-gray-900 mb-2">Sin conexión</h1>
        <p className="text-gray-500 mb-6">
          Parece que no tenés conexión a internet. Revisá tu conexión e intentá de nuevo.
        </p>
        <a href="/"
          className="inline-block bg-brand-500 text-white font-bold px-6 py-3 rounded-2xl shadow-brand">
          Reintentar
        </a>
      </div>
    </div>
  )
}
