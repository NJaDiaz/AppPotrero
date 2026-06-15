
'use client'
import { useRef, useState } from 'react'
import { Upload, Link2, X, Loader2, ImageIcon } from 'lucide-react'
import { uploadImage, type UploadBucket } from '@/lib/upload'
import { toast } from 'sonner'

interface ImageUploaderProps {
  value: string                      
  onChange: (url: string) => void    
  bucket: UploadBucket
  label?: string
  aspectRatio?: 'square' | 'cover' 
}

export default function ImageUploader({
  value,
  onChange,
  bucket,
  label = 'Imagen',
  aspectRatio = 'cover',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [mode, setMode]           = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput]   = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const h = aspectRatio === 'square' ? 'h-32 w-32' : 'h-36 w-full'

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('El archivo debe ser una imagen'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('La imagen no puede superar los 5 MB'); return }

    setUploading(true)
    try {
      const url = await uploadImage(file, bucket)
      onChange(url)
      toast.success('Imagen subida correctamente')
    } catch (err: any) {
      toast.error(err.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleUrlApply = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    toast.success('URL aplicada')
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
  }

  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">{label}</label>

      {value && (
        <div className={`relative ${h} mb-2 rounded-xl overflow-hidden bg-gray-100 group`}>
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-2 bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Subir foto
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" /> Pegar URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
            id={`upload-${label}`}
          />
          <label
            htmlFor={`upload-${label}`}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
              uploading ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                <span className="text-xs text-brand-600 font-semibold">Subiendo...</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-brand-500" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Tocá para elegir una foto</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG o WebP · Máx. 5 MB</p>
                </div>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUrlApply() } }}
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="bg-brand-500 text-white font-bold px-4 rounded-xl text-sm"
          >
            OK
          </button>
        </div>
      )}
    </div>
  )
}
