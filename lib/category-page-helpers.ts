import { getProducts, getSubcategories } from "@/lib/products"
import { toDisplayProduct } from "@/lib/adapters"
import type { DisplayProduct } from "@/lib/adapters"

interface CategoryPageData {
  products: DisplayProduct[]
  subcategories: { slug: string; name: string }[]
  sort: string
  category: string | undefined
  page: number
  totalPages: number
  total: number
}

export async function fetchCategoryPageData(
  parentSlug: string,
  searchParams: { [key: string]: string | string[] | undefined },
): Promise<CategoryPageData> {
  const sort = (typeof searchParams.sort === "string" ? searchParams.sort : "newest") as
    | "newest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1

  const [{ products: dtos, total, totalPages }, subcategories] = await Promise.all([
    getProducts({
      parentCategory: parentSlug,
      category,
      sort,
      page,
      limit: 20,
    }),
    getSubcategories(parentSlug),
  ])

  return {
    products: dtos.map(toDisplayProduct),
    subcategories,
    sort,
    category,
    page,
    totalPages,
    total,
  }
}
