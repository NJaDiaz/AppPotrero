
import { createClient } from '@/lib/supabase/client'

export type UploadBucket = 'business-images' | 'business-logos' | 'place-images'

export async function uploadImage(file: File, bucket: UploadBucket): Promise<string> {
  const supabase = createClient()

  const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw new Error(`Error al subir imagen: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return publicUrl
}


export async function deleteImage(url: string, bucket: UploadBucket): Promise<void> {
  const supabase = createClient()
  const path = url.split(`/${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}
