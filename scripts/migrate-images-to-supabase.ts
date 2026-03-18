import "dotenv/config"
import fs from "fs"
import path from "path"
import { prisma } from "../lib/prisma"
import { uploadProductImage } from "../lib/supabase-storage"

const PUBLIC_DIR = path.join(process.cwd(), "public")

async function main() {
  const images = await prisma.productImage.findMany({
    where: {
      url: { startsWith: "/images/" },
    },
  })

  console.log(`Found ${images.length} local image records to migrate.\n`)

  let success = 0
  let skipped = 0
  let errors = 0

  for (const image of images) {
    const localPath = path.join(PUBLIC_DIR, image.url)
    const fileName = path.basename(image.url)

    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP (file missing): ${image.url}`)
      skipped++
      continue
    }

    try {
      const buffer = fs.readFileSync(localPath)
      const url = await uploadProductImage(fileName, buffer, "image/jpeg")

      await prisma.productImage.update({
        where: { id: image.id },
        data: { url },
      })

      console.log(`  ✓ ${fileName} → ${url}`)
      success++
    } catch (err) {
      console.error(`  ERROR ${fileName}:`, err)
      errors++
    }
  }

  console.log(`\nDone. ${success} migrated, ${skipped} skipped, ${errors} errors.`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).$disconnect()
}

main().catch((e) => {
  console.error(e)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(prisma as any).$disconnect()
  process.exit(1)
})
