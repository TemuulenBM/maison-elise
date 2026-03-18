import "dotenv/config"
import fs from "fs"
import path from "path"
import { uploadProductImage } from "../lib/supabase-storage"

const IMAGES_DIR = path.join(process.cwd(), "public", "images")

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"))
  console.log(`Found ${files.length} site images to upload.\n`)

  const urls: Record<string, string> = {}
  let success = 0
  let errors = 0

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file)
    try {
      const buffer = fs.readFileSync(filePath)
      const url = await uploadProductImage(file, buffer, "image/jpeg")
      urls[file] = url
      console.log(`  ✓ ${file}`)
      success++
    } catch (err) {
      console.error(`  ERROR ${file}:`, err)
      errors++
    }
  }

  console.log(`\nDone. ${success} uploaded, ${errors} errors.\n`)
  console.log("=== lib/site-images.ts ===")
  console.log(`const BASE = "https://qtvmfbicoibfdbhaksoz.supabase.co/storage/v1/object/public/products"\n`)
  console.log("export const SITE_IMAGES = {")
  for (const [file, url] of Object.entries(urls)) {
    const key = file.replace(/\.(jpg|png|webp)$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    console.log(`  ${key}: \`\${BASE}/${file}\`,  // ${url}`)
  }
  console.log("} as const")
}

main().catch((e) => { console.error(e); process.exit(1) })
