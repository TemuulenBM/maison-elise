// ─── Legacy types (одоогийн UI-д ашиглагдаж байгаа) ───

export interface Product {
  id: string;
  name: string;
  edition: string;
  price: number;
  image: string;
  colors: ProductColor[];
  category: string;
  description?: string;
  details?: string;
  materials?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Category {
  name: string;
  subcategories: string[];
}

// ─── Database-backed types (Phase 1 Commerce Core) ───

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED";

export type ProductStatusType = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface VariantAttributes {
  color: string;
  colorHex: string;
  size?: string;
}

export interface ProductVariantDTO {
  id: string;
  sku: string;
  attributes: VariantAttributes;
  price: number; // priceOverride ?? product.basePrice (цент)
  stockQuantity: number;
  reserved: number;
  available: number; // stockQuantity - reserved
  images: ProductImageDTO[];
}

export interface ProductImageDTO {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  edition: string | null;
  description: string | null;
  details: string | null;
  materials: string | null;
  materialStory: string | null;
  basePrice: number; // цент
  status: ProductStatusType;
  category: { id: string; slug: string; name: string } | null;
  collection: { id: string; slug: string; name: string } | null;
  variants: ProductVariantDTO[];
  images: ProductImageDTO[];
}

export interface ServerCartItemDTO {
  id: string;
  variantId: string;
  quantity: number;
  priceAtAdd: number; // цент
  variant: {
    id: string;
    sku: string;
    attributes: VariantAttributes;
    price: number;
    available: number;
    product: {
      id: string;
      slug: string;
      name: string;
      edition: string | null;
    };
    images: ProductImageDTO[];
  };
}

export interface CartDTO {
  id: string;
  items: ServerCartItemDTO[];
  totalAmount: number; // цент
  totalItems: number;
}

export interface OrderDTO {
  id: string;
  status: OrderStatus;
  totalAmount: number; // цент
  paymentIntentId: string | null;
  shippingAddress: ShippingAddressDTO;
  giftPackaging: boolean;
  giftNote: string | null;
  items: OrderItemDTO[];
  createdAt: string;
}

export interface OrderItemDTO {
  id: string;
  quantity: number;
  priceAtPurchase: number; // цент
  variant: {
    id: string;
    sku: string;
    attributes: VariantAttributes;
    product: {
      id: string;
      slug: string;
      name: string;
    };
    images: ProductImageDTO[];
  };
}

export interface ShippingAddressDTO {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// ─── Utility: цент → доллар хөрвүүлэх ───

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
