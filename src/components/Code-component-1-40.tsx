import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Camera, Video, Shirt, Palette, ArrowRight, Check, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ServicesPage() {
  const services = [
    {
      title: 'Studio',
      tagline: 'Weddings & Portraits',
      description: 'Premium wedding photography and cinematography services that capture your most precious moments with artistic excellence and emotional depth.',
      icon: Camera,
      image: 'https://images.unsplash.com/photo-1669789748471-81548abdbe8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBzZXNzaW9ufGVufDF8fHx8MTc1NzU5ODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-pink-500 to-rose-600',
      features: [
        'Pre-wedding shoots',
        'Wedding day coverage',
        'Destination weddings',
        'Traditional ceremonies',
        'Couple portraits',
        'Family portraits',
        'Professional editing',
        'Custom album design'
      ],
      packages: [
        { name: 'Essential', price: '₹50,000', duration: '1 Day' },
        { name: 'Premium', price: '₹1,00,000', duration: '2 Days' },
        { name: 'Luxury', price: '₹2,00,000', duration: '3 Days' }
      ]
    },
    {
      title: 'Production',
      tagline: 'Events & Films',
      description: 'Professional video production for corporate events, documentaries, commercials, and creative content that tells compelling stories.',
      icon: Video,
      image: 'https://images.unsplash.com/photo-1655828913505-9fb4193d4452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb24lMjBmaWxtaW5nfGVufDF8fHx8MTc1NzU5ODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Corporate videos',
        'Event coverage',
        'Documentary films',
        'Commercial ads',
        'Music videos',
        'Training videos',
        'Live streaming',
        '4K production'
      ],
      packages: [
        { name: 'Basic', price: '₹25,000', duration: 'Half Day' },
        { name: 'Standard', price: '₹50,000', duration: 'Full Day' },
        { name: 'Premium', price: '₹1,00,000', duration: 'Multi-Day' }
      ]
    },
    {
      title: 'Customs',
      tagline: 'Branded Merchandise',
      description: 'Custom branded merchandise and unique products that represent your brand with style, quality, and attention to detail.',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1682517254473-174fc5acec2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlfGN1c3RvbSUyMG1lcmNoYW5kaXNlJTIwYnJhbmRpbmd8ZW58MXx8fHwxNzU3NTk4ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-green-500 to-teal-600',
      features: [
        'Custom apparel',
        'Brand merchandise',
        'Promotional items',
        'Gift solutions',
        'Corporate gifts',
        'Event swag',
        'Packaging design',
        'Print management'
      ],
      packages: [
        { name: 'Starter', price: '₹500', duration: 'Per Item' },
        { name: 'Bulk', price: '₹300', duration: 'Per Item' },
        { name: 'Premium', price: '₹1000', duration: 'Per Item' }
      ]
    },
    {
      title: 'Creative Agency',
      tagline: 'Digital Solutions',
      description: 'Comprehensive digital marketing, branding, and creative services including social media management, web solutions, and digital campaigns.',
      icon: Palette,
      image: 'https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDk2MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Social media management',
        'Brand identity design',
        'Website development',
        'Digital campaigns',
        'Content creation',
        'Portfolio shoots',
        'SEO optimization',
        'Analytics & reporting'
      ],
      packages: [
        { name: 'Starter', price: '₹15,000', duration: 'Per Month' },
        { name: 'Growth', price: '₹30,000', duration: 'Per Month' },
        { name: 'Enterprise', price: '₹60,000', duration: 'Per Month' }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Amit & Preeti",
      service: "Studio",
      content: "Mak Stark made our wedding day magical! Every photo tells a beautiful story.",
      rating: 5
    },
    {
      name: "TechCorp Solutions",
      service: "Production",
      content: "Professional video production that exceeded our expectations. Highly recommended!",
      rating: 5
    },
    {
      name: "Fashion Brand Co.",
      service: "Creative Agency",
      content: "Their social media strategy increased our engagement by 300%. Amazing results!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTc1OTQ5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Four specialized verticals delivering comprehensive creative solutions for all your needs
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={service.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`bg-gradient-to-r ${service.color} p-3 rounded-lg`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                        <p className="text-gray-400">{service.tagline}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-white font-semibold mb-4">What's Included:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-gray-300">
                            <Check size={16} className="text-green-400 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Packages */}
                    <div className="mb-8">
                      <h4 className="text-white font-semibold mb-4">Packages:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {service.packages.map((pkg, pkgIndex) => (
                          <Card key={pkgIndex} className="bg-gray-800/50 border-gray-700">
                            <CardContent className="p-4 text-center">
                              <h5 className="text-white font-semibold mb-2">{pkg.name}</h5>
                              <div className="text-2xl font-bold text-blue-400 mb-1">{pkg.price}</div>
                              <div className="text-gray-400 text-sm">{pkg.duration}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <Button className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                      Learn More <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                  
                  {/* Image */}
                  <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
                    <div className="relative h-96 rounded-2xl overflow-hidden">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A streamlined approach to bringing your vision to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Understanding your vision and requirements' },
              { step: '02', title: 'Strategy', desc: 'Developing a comprehensive creative strategy' },
              { step: '03', title: 'Execution', desc: 'Bringing your project to life with precision' },
              { step: '04', title: 'Delivery', desc: 'Final delivery with ongoing support' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Client Success Stories</h2>
            <p className="text-gray-400 text-lg">What our clients say about our services</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6 h-full">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-auto">
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {testimonial.service}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Project Today
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Ready to bring your vision to life? Contact us for a consultation and let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/contact">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
                Mak Stark
              </div>
              <p className="text-gray-400 mb-4">
                Creating extraordinary experiences through premium creative solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Wedding Photography</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Video Production</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Custom Merchandise</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Creative Agency</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Haldia, West Bengal</li>
                <li>hello@makstark.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mak Stark. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}