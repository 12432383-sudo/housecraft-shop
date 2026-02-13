import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Sparkles, Heart, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { useSettings } from '@/contexts/SettingsContext';
import { categoryLabels, ProductCategory } from '@/types/product';
import heroCraft from '@/assets/hero-craft.jpg';

const occasions = [
  { icon: Heart, title: 'Weddings', description: 'Unique handcrafted gifts for the special day' },
  { icon: Gift, title: 'Birthdays', description: 'Personalized gifts that make memories' },
  { icon: Star, title: 'Celebrations', description: 'Mark every milestone with artisan crafts' },
  { icon: Sparkles, title: 'Just Because', description: 'Treat yourself or surprise someone special' },
];

const Index = () => {
  const { getFeaturedProducts, getVisibleProducts } = useProducts();
  const { settings } = useSettings();
  const featuredProducts = getFeaturedProducts();
  const visibleProducts = getVisibleProducts();

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({
    key: key as ProductCategory,
    label: label.en,
    count: visibleProducts.filter(p => p.category === key).length,
  }));

  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your handcrafted products. Can you help me choose something special?"
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroCraft}
            alt="Handcrafted products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container-main relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8 animate-fade-up">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wider uppercase text-sm">
                Handmade with Love
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight">
                Crafted
                <span className="text-gradient block">Whispers</span>
                of Art
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discover unique handcrafted pieces that tell stories. From resin art to scented candles, each creation is made with passion and care.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button variant="warm" size="lg" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Explore Collection
                </Button>
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">WhatsApp</span>
              </a>
              <a
                href={`https://instagram.com/${settings.instagramAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of handcrafted creations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={`/shop?category=${cat.key}`}
                className="card-elegant rounded-xl p-6 text-center group"
              >
                <h3 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cat.count} {cat.count === 1 ? 'product' : 'products'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-cream-dark/30">
          <div className="container-main">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Featured Creations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular handcrafted pieces, chosen just for you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/shop">
                <Button variant="outline" size="lg">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Occasions */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Perfect for Every Occasion
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the ideal handcrafted gift for any moment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((occasion, index) => (
              <div
                key={index}
                className="card-elegant rounded-xl p-8 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <occasion.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg">{occasion.title}</h3>
                <p className="text-sm text-muted-foreground">{occasion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-warm-brown text-cream">
        <div className="container-main text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to Order?
          </h2>
          <p className="text-cream/70 max-w-xl mx-auto">
            Get in touch with us to place your order or discuss a custom design.
            We'd love to create something special for you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="lg" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </Button>
            </a>
            <a
              href={`https://instagram.com/${settings.instagramAccount}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 border-cream text-cream hover:bg-cream hover:text-warm-brown">
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
