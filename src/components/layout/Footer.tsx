import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Phone, Mail } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-warm-brown text-cream py-16">
      <div className="container-main px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold">The Craft House</h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              Handcrafted with love. Each piece tells a unique story, made with premium materials and artisan care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-cream/70 hover:text-cream transition-colors text-sm">Home</Link>
              <Link to="/shop" className="text-cream/70 hover:text-cream transition-colors text-sm">Shop</Link>
              <Link to="/about" className="text-cream/70 hover:text-cream transition-colors text-sm">About</Link>
              <Link to="/contact" className="text-cream/70 hover:text-cream transition-colors text-sm">Contact</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`https://instagram.com/${settings.instagramAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                @{settings.instagramAccount}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/20 text-center">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} The Craft House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
