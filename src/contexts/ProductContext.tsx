import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory, categoryLabels } from '@/types/product';
import { sampleProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getVisibleProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Convert DB row to Product type
const rowToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  nameAr: row.name_ar || undefined,
  description: row.description,
  descriptionAr: row.description_ar || undefined,
  price: row.price || undefined,
  showPrice: row.show_price,
  category: row.category as ProductCategory,
  images: row.images || ['/placeholder.svg'],
  sizeImage: row.size_image || undefined,
  sizeType: row.size_type || 'one-size',
  sizes: (Array.isArray(row.sizes) ? row.sizes : []) as Product['sizes'],
  customNotes: row.custom_notes || undefined,
  customNotesAr: row.custom_notes_ar || undefined,
  isVisible: row.is_visible,
  featured: row.featured,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error fetching products:', error);
          }
          // Fall back to sample products if table doesn't exist
          setProducts(sampleProducts);
          return;
        }

        if (data && data.length > 0) {
          setProducts(
            data
              .map(rowToProduct)
              .filter((p: Product) => p.category && categoryLabels[p.category])
          );
        } else {
          // No products in DB yet, use samples
          setProducts(sampleProducts);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching products:', err);
        }
        setProducts(sampleProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          name_ar: productData.nameAr || null,
          description: productData.description,
          description_ar: productData.descriptionAr || null,
          price: productData.price || null,
          show_price: productData.showPrice,
          category: productData.category,
          images: productData.images,
          size_image: productData.sizeImage || null,
          size_type: productData.sizeType,
          sizes: productData.sizes as any,
          custom_notes: productData.customNotes || null,
          custom_notes_ar: productData.customNotesAr || null,
          is_visible: productData.isVisible,
          featured: productData.featured,
        })
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error adding product:', error);
        // Fallback: add locally
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProducts(prev => [...prev, newProduct]);
        return;
      }

      if (data) {
        setProducts(prev => [rowToProduct(data), ...prev]);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error adding product:', err);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistically update local state
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );

    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr || null;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.descriptionAr !== undefined) dbUpdates.description_ar = updates.descriptionAr || null;
      if (updates.price !== undefined) dbUpdates.price = updates.price || null;
      if (updates.showPrice !== undefined) dbUpdates.show_price = updates.showPrice;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.sizeImage !== undefined) dbUpdates.size_image = updates.sizeImage || null;
      if (updates.sizeType !== undefined) dbUpdates.size_type = updates.sizeType;
      if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
      if (updates.customNotes !== undefined) dbUpdates.custom_notes = updates.customNotes || null;
      if (updates.customNotesAr !== undefined) dbUpdates.custom_notes_ar = updates.customNotesAr || null;
      if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error && import.meta.env.DEV) {
        console.error('Error updating product:', error);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error && import.meta.env.DEV) {
        console.error('Error deleting product:', error);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error deleting product:', err);
    }
  };

  const getProduct = (id: string) => products.find(p => p.id === id);
  const getFeaturedProducts = () => products.filter(p => p.featured && p.isVisible);
  const getVisibleProducts = () => products.filter(p => p.isVisible);
  const getProductsByCategory = (category: string) =>
    products.filter(p => p.category === category && p.isVisible);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getFeaturedProducts,
        getVisibleProducts,
        getProductsByCategory,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
