import { useState } from 'react';
import { MessageCircle, Instagram, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a success message
    toast({
      title: 'Message sent!',
      description: "Thank you for reaching out. We'll get back to you soon!",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us directly',
      action: `https://wa.me/${settings.whatsappNumber}`,
      label: 'Open WhatsApp',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      description: `@${settings.instagramAccount}`,
      action: `https://instagram.com/${settings.instagramAccount}`,
      label: 'Follow us',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: settings.whatsappNumber,
      action: `tel:${settings.whatsappNumber}`,
      label: 'Call us',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'hello@thecrafthouse.com',
      action: 'mailto:hello@thecrafthouse.com',
      label: 'Send email',
    },
  ];

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold">Get in Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our products,
              need a custom order, or just want to say hello!
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                target="_blank"
                rel="noopener noreferrer"
                className="card-elegant rounded-xl p-6 text-center space-y-3 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold">{method.title}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card-elegant rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Your message..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" variant="warm" size="lg" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Map / Extra Info */}
          <div className="mt-16 text-center space-y-4">
            <h2 className="text-2xl font-serif font-bold">Visit Our Workshop</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We welcome visitors to our workshop by appointment. Get in touch to schedule
              a visit and see the magic behind our handcrafted creations.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
