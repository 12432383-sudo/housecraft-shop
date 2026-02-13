import { Heart, Palette, Sparkles, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import aboutCraft from '@/assets/about-craft.jpg';

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every piece is crafted with genuine passion and care, ensuring each creation is truly special.',
  },
  {
    icon: Palette,
    title: 'Unique Designs',
    description: 'Our designs are original and unique, reflecting creativity and artistic expression in every detail.',
  },
  {
    icon: Sparkles,
    title: 'Quality Materials',
    description: 'We use only premium materials to ensure lasting quality and beauty in every handcrafted piece.',
  },
  {
    icon: Star,
    title: 'Custom Orders',
    description: 'We love bringing your ideas to life. Custom orders are welcome for a truly personalized experience.',
  },
];

const process = [
  { step: '01', title: 'Inspiration', description: 'We draw inspiration from nature, art, and your unique stories.' },
  { step: '02', title: 'Design', description: 'Each piece is carefully designed with attention to every detail.' },
  { step: '03', title: 'Craft', description: 'Handcrafted with premium materials and artisan techniques.' },
  { step: '04', title: 'Deliver', description: 'Carefully packaged and delivered to bring joy to your doorstep.' },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutCraft}
            alt="About us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <div className="container-main relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 animate-fade-up">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up">
            Bringing handcrafted beauty into everyday life
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold">The Craft House</h2>
            <p className="text-muted-foreground leading-relaxed">
              Born from a deep love for handmade art, The Craft House is a creative haven where
              imagination meets craftsmanship. We believe that every handcrafted piece carries a
              story — one of patience, passion, and purpose.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From delicately poured resin trays to hand-stitched embroidery, each creation in our
              collection is thoughtfully designed and meticulously crafted. We take pride in using
              only the finest materials, ensuring that every piece not only looks beautiful but
              stands the test of time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're looking for a unique gift, a special home accent, or a personalized
              keepsake, we're here to make your vision a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream-dark/30">
        <div className="container-main">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            What We Believe In
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-elegant rounded-xl p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Our Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <span className="text-5xl font-serif font-bold text-primary/20">
                  {step.step}
                </span>
                <h3 className="font-serif font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
