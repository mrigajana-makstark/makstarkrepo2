import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
// @ts-ignore TS: no declaration file for 'lucide-react'
import { ChevronRight, Play, Camera, Video, Shirt, Palette, Star, Users, Award, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ weddings: 0, campaigns: 0, orders: 0 });

  // Hero background images rotation
  const heroImages = [
    'https://ik.imagekit.io/makstark/MS%20WEBSITE/_MAK4756.png?updatedAt=1758650821029  ',
    'https://ik.imagekit.io/makstark/MS%20WEBSITE/11%20(19).jpg?updatedAt=1757604547675',
    'https://ik.imagekit.io/makstark/MS%20WEBSITE/11%20(17).jpg?updatedAt=1757604582542'
  ];

  const projects = [
    { id: 1, title: 'Royal Wedding Collection', category: 'Wedding', image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/11%20(16).jpg?updatedAt=1757604539201'},//heroImages[0] },
    { id: 2, title: 'Corporate Brand Campaign', category: 'Campaign', image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/_MAK5700.jpg?updatedAt=1757505886853' },
    { id: 3, title: 'Custom Merch Line', category: 'Merchandise', image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/web.png?updatedAt=1757618724118' },
  ];

  const verticals = [
    {
      title: 'Studio',
      description: 'Premium wedding photography & cinematography',
      icon: Camera,
      image: heroImages[0],
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Production',
      description: 'Events, films & corporate videos',
      icon: Video,
      image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/IMG-20250821-WA0002.jpg?updatedAt=1757505841835',//heroImages[1],
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Customs',
      description: 'Branded merchandise & custom products',
      icon: Shirt,
      image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/web.png?updatedAt=1757618724118',//heroImages[2],
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Creative Agency',
      description: 'Social media, branding & digital solutions',
      icon: Palette,
      image: 'https://ik.imagekit.io/makstark/MS%20WEBSITE/_MAK4761.JPG?updatedAt=1757507642648',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const testimonials = [
    {
      name: "Priya & Rahul",
      role: "Wedding Couple",
      content: "Mak Stark captured our special day perfectly! Their creativity and professionalism exceeded our expectations.",
      rating: 5
    },
    {
      name: "Tech Innovators Ltd",
      role: "Corporate Client",
      content: "Outstanding video production for our product launch. The team delivered cinematic quality on time and budget.",
      rating: 5
    },
    {
      name: "Fashion Forward",
      role: "Brand Partner",
      content: "Their custom merchandise designs helped us create a unique brand identity. Highly recommended!",
      rating: 5
    }
  ];

  // Animate counters
  useEffect(() => {
    const animateStats = () => {
      const targetStats = { weddings: 30, campaigns: 50, orders: 1000 };
      let current = { weddings: 0, campaigns: 0, orders: 0 };
      
      const increment = () => {
        if (current.weddings < targetStats.weddings) current.weddings += 5;
        if (current.campaigns < targetStats.campaigns) current.campaigns += 1;
        if (current.orders < targetStats.orders) current.orders += 20;
        
        setStats({ ...current });
        
        if (current.weddings < targetStats.weddings || 
            current.campaigns < targetStats.campaigns || 
            current.orders < targetStats.orders) {
          setTimeout(increment, 50);
        }
      };
      
      increment();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  // Auto-slide for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Typing effect for headline
  const headline = "We Create. We Capture. We Customize.";
  const [typedText, setTypedText] = useState("");
  useEffect(() => {
    setTypedText(""); // reset on mount
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(headline.slice(0, i + 1));
      i++;
      if (i === headline.length) clearInterval(interval);
    }, 50); // typing speed in ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroImages[0]}
            alt="Mak Stark Creative Work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent"
            >
              {typedText}
              <span className="animate-pulse">|</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Premium creative solutions for weddings, events, merchandise, and digital campaigns
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                <Link to="/portfolio">View Our Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-black">
                <Link to="/contact">Book Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                <Link to="/services">Shop Merch</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Verticals Showcase */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Our Creative Verticals
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Four specialized divisions working in perfect harmony to bring your vision to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {verticals.map((vertical, index) => {
              const IconComponent = vertical.icon;
              return (
                <motion.div
                  key={vertical.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-gray-900/50 border-gray-800 h-full overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={vertical.image}
                        alt={vertical.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${vertical.color} opacity-80`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent size={48} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{vertical.title}</h3>
                      <p className="text-gray-400 mb-4">{vertical.description}</p>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
                        Explore <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Signature Projects Slider */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Mak Stark Originals
            </h2>
            <p className="text-gray-400 text-lg">Our signature projects that define excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-blue-400 text-sm font-medium">{project.category}</span>
                      <h3 className="text-white text-lg font-bold">{project.title}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section id="stats-section" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl font-bold mb-2">{stats.weddings}+</div>
              <div className="text-blue-100">Weddings Captured</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">{stats.campaigns}+</div>
              <div className="text-blue-100">Gigs</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-5xl font-bold mb-2">{stats.orders}+</div>
              <div className="text-blue-100">Custom Orders</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Trusted by Brands & Couples Alike</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for client logos */}
            <div className="w-32 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Brand Logo</span>
            </div>
            <div className="w-32 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Brand Logo</span>
            </div>
            <div className="w-32 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Brand Logo</span>
            </div>
            <div className="w-32 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Brand Logo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mak Stark */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">Why Choose Mak Stark?</h2>
              <div className="space-y-6">
                {[
                  { icon: Star, title: 'Creative Excellence', desc: 'Award-winning creative solutions that stand out' },
                  { icon: Users, title: 'Reliable Team', desc: 'Professional team dedicated to your success' },
                  { icon: Award, title: 'End-to-End Solutions', desc: 'Complete creative services under one roof' },
                  { icon: Heart, title: 'Youth-Centric', desc: 'Modern approach that resonates with today\'s audience' }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="bg-blue-500/20 p-3 rounded-lg">
                        <IconComponent size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDk2MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Mak Stark Team at Work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-gray-400">Real stories from real clients</p>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 italic">
                &ldquo;{testimonials[currentSlide].content}&rdquo;
              </p>
              <div>
                <div className="text-white font-semibold">{testimonials[currentSlide].name}</div>
                <div className="text-blue-400 text-sm">{testimonials[currentSlide].role}</div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Build Something Iconic Together
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Ready to bring your vision to life? Get in touch with our creative team today.
            </p>
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/contact">Start Your Project Now</Link>
            </Button>
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
              <div className="flex space-x-4">
                {/* Social icons would go here */}
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
              </div>
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
                <li>info.makstark@gmail.com</li>
                <li>+91 8653802996</li>
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