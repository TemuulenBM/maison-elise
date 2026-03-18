import { SITE_IMAGES } from "@/lib/site-images";
import type { Product, ProductColor, ProductDTO } from "@/types";

export interface DisplayProduct extends Product {
  defaultVariantId: string;
  variantMap: Record<string, string>; // colorName → variantId
}

export function toDisplayProduct(dto: ProductDTO): DisplayProduct {
  const primaryImage =
    dto.images.find((i) => i.isPrimary)?.url ??
    dto.variants[0]?.images[0]?.url ??
    SITE_IMAGES.productCyme;

  const colors: ProductColor[] = dto.variants.map((v) => ({
    name: v.attributes.color,
    hex: v.attributes.colorHex,
    image: v.images[0]?.url ?? primaryImage,
  }));

  return {
    id: dto.slug,
    name: dto.name,
    edition: dto.edition ?? "",
    price: dto.basePrice / 100,
    image: primaryImage,
    colors:
      colors.length > 0
        ? colors
        : [{ name: "Default", hex: "#1A1A1A", image: primaryImage }],
    category: dto.category?.slug ?? "handbags",
    description: dto.description ?? undefined,
    details: dto.details ?? undefined,
    materials: dto.materials ?? undefined,
    defaultVariantId: dto.variants[0]?.id ?? "",
    variantMap: Object.fromEntries(
      dto.variants.map((v) => [v.attributes.color, v.id])
    ),
  };
}
