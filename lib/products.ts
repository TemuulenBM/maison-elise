import { prisma } from "./prisma";
import type { ProductQuery } from "./validators/product";
import type { ProductDTO, ProductVariantDTO, ProductImageDTO } from "@/types";

// ─── Prisma → DTO хөрвүүлэгч ───

function toImageDTO(img: {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}): ProductImageDTO {
  return {
    id: img.id,
    url: img.url,
    altText: img.altText,
    sortOrder: img.sortOrder,
    isPrimary: img.isPrimary,
  };
}

function toVariantDTO(
  variant: {
    id: string;
    sku: string;
    attributes: unknown;
    priceOverride: number | null;
    stockQuantity: number;
    reserved: number;
    images: { id: string; url: string; altText: string | null; sortOrder: number; isPrimary: boolean }[];
  },
  basePrice: number
): ProductVariantDTO {
  const attrs = variant.attributes as { color: string; colorHex: string; size?: string };
  return {
    id: variant.id,
    sku: variant.sku,
    attributes: attrs,
    price: variant.priceOverride ?? basePrice,
    stockQuantity: variant.stockQuantity,
    reserved: variant.reserved,
    available: variant.stockQuantity - variant.reserved,
    images: variant.images.map(toImageDTO),
  };
}

// ─── Query helpers ───

export async function getProducts(query: ProductQuery): Promise<{
  products: ProductDTO[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const { category, collection, status, sort, page, limit, search } = query;

  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  else where.status = "ACTIVE";

  if (category) {
    where.category = { slug: category };
  }
  if (collection) {
    where.collection = { slug: collection };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { edition: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> = {};
  switch (sort) {
    case "price_asc":
      orderBy.basePrice = "asc";
      break;
    case "price_desc":
      orderBy.basePrice = "desc";
      break;
    case "name_asc":
      orderBy.name = "asc";
      break;
    case "newest":
    default:
      orderBy.createdAt = "desc";
      break;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, slug: true, name: true } },
        collection: { select: { id: true, slug: true, name: true } },
        variants: {
          include: { images: { orderBy: { sortOrder: "asc" } } },
        },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const products: ProductDTO[] = items.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    edition: p.edition,
    description: p.description,
    details: p.details,
    materials: p.materials,
    materialStory: p.materialStory,
    basePrice: p.basePrice,
    status: p.status,
    category: p.category,
    collection: p.collection,
    variants: p.variants.map((v) => toVariantDTO(v, p.basePrice)),
    images: p.images.map(toImageDTO),
  }));

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, slug: true, name: true } },
      collection: { select: { id: true, slug: true, name: true } },
      variants: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    edition: p.edition,
    description: p.description,
    details: p.details,
    materials: p.materials,
    materialStory: p.materialStory,
    basePrice: p.basePrice,
    status: p.status,
    category: p.category,
    collection: p.collection,
    variants: p.variants.map((v) => toVariantDTO(v, p.basePrice)),
    images: p.images.map(toImageDTO),
  };
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, slug: true, name: true } },
      collection: { select: { id: true, slug: true, name: true } },
      variants: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    edition: p.edition,
    description: p.description,
    details: p.details,
    materials: p.materials,
    materialStory: p.materialStory,
    basePrice: p.basePrice,
    status: p.status,
    category: p.category,
    collection: p.collection,
    variants: p.variants.map((v) => toVariantDTO(v, p.basePrice)),
    images: p.images.map(toImageDTO),
  };
}
