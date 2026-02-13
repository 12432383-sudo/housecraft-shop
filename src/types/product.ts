export interface ProductSize {
  name: string;
  priceAdjustment?: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price?: number;
  showPrice: boolean;
  category: ProductCategory;
  images: string[];
  sizeImage?: string;
  sizeType: 'one-size' | 'multiple';
  sizes: ProductSize[];
  customNotes?: string;
  customNotesAr?: string;
  isVisible: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory =
  | 'candle'
  | 'resin'
  | 'concrete'
  | 'embroidery';

export const categoryLabels: Record<ProductCategory, { en: string; ar: string }> = {
  candle: { en: 'Candle', ar: 'شموع' },
  resin: { en: 'Resin', ar: 'ريزن' },
  concrete: { en: 'Concrete', ar: 'خرسانة' },
  embroidery: { en: 'Embroidery', ar: 'تطريز' },
};
