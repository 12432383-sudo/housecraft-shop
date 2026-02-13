import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Product, categoryLabels } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { settings } = useSettings();
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${product.name}". Can you tell me more about it?`
  );

  return (
    <div className="card-elegant rounded-xl overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`} className="block flex-1">
            <h3 className="font-serif font-semibold text-lg leading-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {categoryLabels[product.category]?.en || product.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          {product.showPrice && product.price ? (
            <span className="font-serif font-bold text-lg text-primary">
              ${product.price}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Contact for price
            </span>
          )}

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Order
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
