import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Instagram, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useProducts } from '@/contexts/ProductContext';
import { useSettings } from '@/contexts/SettingsContext';
import { categoryLabels } from '@/types/product';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { settings } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Product not found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${product.name}". Can you tell me more about it?`
  );

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${product.category}`}
              className="hover:text-primary transition-colors"
            >
              {categoryLabels[product.category]?.en || product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === selectedImage
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-muted-foreground/30'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="secondary">
                  {categoryLabels[product.category]?.en || product.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold">
                  {product.name}
                </h1>
                {product.nameAr && (
                  <p className="text-lg text-muted-foreground" dir="rtl">
                    {product.nameAr}
                  </p>
                )}
              </div>

              {product.showPrice && product.price ? (
                <p className="text-3xl font-serif font-bold text-primary">
                  ${product.price}
                </p>
              ) : (
                <p className="text-lg text-muted-foreground italic">
                  Contact us for pricing
                </p>
              )}

              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">{product.description}</p>
                {product.descriptionAr && (
                  <p className="text-muted-foreground leading-relaxed" dir="rtl">
                    {product.descriptionAr}
                  </p>
                )}
              </div>

              {/* Sizes */}
              {product.sizeType === 'multiple' && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, i) => (
                      <Badge key={i} variant="outline" className="px-4 py-2">
                        {size.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Image */}
              {product.sizeImage && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Size Guide</h3>
                  <img
                    src={product.sizeImage}
                    alt="Size guide"
                    className="rounded-lg border max-w-[200px]"
                  />
                </div>
              )}

              {/* Custom Notes */}
              {product.customNotes && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">{product.customNotes}</p>
                  {product.customNotesAr && (
                    <p className="text-sm text-muted-foreground mt-2" dir="rtl">
                      {product.customNotesAr}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </Button>
                </a>
                <a
                  href={`https://instagram.com/${settings.instagramAccount}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <Instagram className="w-5 h-5" />
                    View on Instagram
                  </Button>
                </a>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors pt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
