import { createServiceClient } from "./supabase"

const BUCKET = "products"

export async function uploadProductImage(
  fileName: string,
  fileBuffer: Buffer,
  contentType = "image/jpeg"
): Promise<string> {
  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, { contentType, upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}
