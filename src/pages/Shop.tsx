import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { categoryLabels, ProductCategory } from '@/types/product';

const Shop = () => {
  const { getVisibleProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') as ProductCategory | null;

  const visibleProducts = getVisibleProducts();

  const filteredProducts = useMemo(() => {
    let result = visibleProducts;

    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.nameAr && p.nameAr.includes(searchQuery)) ||
          (p.descriptionAr && p.descriptionAr.includes(searchQuery))
      );
    }

    return result;
  }, [visibleProducts, activeCategory, searchQuery]);

  const handleCategoryFilter = (category: ProductCategory | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold">Our Shop</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of handcrafted products, each made with love and attention to detail.
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-6 mb-10">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={activeCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(null)}
              >
                All
              </Button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={activeCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter(key as ProductCategory)}
                >
                  {label.en}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            {activeCategory && (
              <Badge variant="secondary" className="gap-1">
                {categoryLabels[activeCategory]?.en}
                <button onClick={() => handleCategoryFilter(null)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <SlidersHorizontal className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="font-serif text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
