import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Camera, Video, Shirt, Palette, Users, Award, Target, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const teamMembers = [
    {
      name: "Mriganka Jana",
      role: "Founder & Creative Director",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/Untitled%20(3).png?updatedAt=1757505859127"
    },
    {
      name: "Ayan Maity",
      role: "Head of Marketting & Delivery Manager",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/ayan_KngesTWsSo?updatedAt=1757506128145"
    },
    {
      name: "Sujay Charkaborty",
      role: "Human Resources Lead",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/Team/_MAK5420.JPG?updatedAt=1757681804003"
    },
    {
      name: "Srijita Maity",
      role: "Brand Strategy Manager & PR Head",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/_MAK3023%20(1).jpg?updatedAt=1757505862795"
    },
    {
      name: "Debmalya Mondal",
      role: "Photography Lead",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/_MAK5924(1).JPG?updatedAt=1757682526294"
    },
    {
      name: "Sonia Bag",
      role: "Social Media Manager & Content Creator",
      image: "https://ik.imagekit.io/makstark/MS%20WEBSITE/Team/_MAK3309.JPG?updatedAt=1757681805010"
    }
  ];

  const verticals = [
    {
      title: 'Studio',
      description: 'Premium wedding photography and cinematography services that capture your most precious moments with artistic excellence.',
      icon: Camera,
      features: ['Pre-wedding shoots', 'Wedding day coverage', 'Destination weddings', 'Album design']
    },
    {
      title: 'Production',
      description: 'Professional video production for events, corporate films, and creative content that tells your story.',
      icon: Video,
      features: ['Corporate videos', 'Event coverage', 'Documentary films', 'Commercial ads']
    },
    {
      title: 'Customs',
      description: 'Custom branded merchandise and unique products that represent your brand with style and quality.',
      icon: Shirt,
      features: ['Brand merchandise', 'Custom apparel', 'Promotional items', 'Gift solutions']
    },
    {
      title: 'Creative Agency',
      description: 'Comprehensive digital solutions including social media marketing, branding, and creative campaigns.',
      icon: Palette,
      features: ['Social media management', 'Brand identity', 'Web solutions', 'Digital campaigns']
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDk2MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Mak Stark Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              About Mak Stark
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto px-4"
            >
              Where creativity meets excellence, and stories come to life
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-300">
                <p>
                  Founded in 2020, Mak Stark emerged from a simple yet powerful vision: to create extraordinary 
                  experiences through the perfect blend of creativity, technology, and storytelling. What started 
                  as a passion project between two friends has evolved into a comprehensive creative agency serving 
                  clients across India.
                </p>
                <p>
                  Our journey began in the wedding photography space, where we discovered our unique ability to 
                  capture not just moments, but emotions and stories. This foundation of authentic storytelling 
                  became the cornerstone of everything we do, whether it's a intimate wedding ceremony or a 
                  large-scale corporate campaign.
                </p>
                <p>
                  Today, Mak Stark stands as a testament to the power of creative collaboration, bringing together 
                  talented professionals from diverse backgrounds to deliver unparalleled creative solutions across 
                  four specialized verticals.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <Card className="bg-blue-600 border-0 text-white p-6">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-blue-100">Creative Verticals</div>
                </Card>
                <Card className="bg-purple-600 border-0 text-white p-6">
                  <div className="text-3xl font-bold">300+</div>
                  <div className="text-purple-100">Happy Clients</div>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="bg-green-600 border-0 text-white p-6">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-green-100">Projects Completed</div>
                </Card>
                <Card className="bg-orange-600 border-0 text-white p-6">
                  <div className="text-3xl font-bold">4+</div>
                  <div className="text-orange-100">Years Experience</div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize the creative industry by delivering exceptional, story-driven content that 
                connects brands with their audiences and helps couples preserve their most precious memories 
                through innovative visual storytelling.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become India's most trusted creative partner, known for our ability to transform ideas 
                into compelling visual narratives that inspire, engage, and create lasting impact across 
                all creative disciplines.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Four Verticals */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">The Four Verticals</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our specialized divisions working in harmony to deliver comprehensive creative solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {verticals.map((vertical, index) => {
              const IconComponent = vertical.icon;
              return (
                <motion.div
                  key={vertical.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 p-8 h-full hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="bg-blue-500/20 p-3 rounded-lg">
                        <IconComponent size={32} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{vertical.title}</h3>
                        <p className="text-gray-300">{vertical.description}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {vertical.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Talented individuals united by a passion for creativity and excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-3xl md:text-4xl font-bold text-white mb-8 italic">
              &ldquo;Creativity is our currency, stories are our product.&rdquo;
            </blockquote>
            <p className="text-blue-100 text-lg">
              — Mak Stark Philosophy
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Ready to bring your vision to life? Our team is here to help you create something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                <Link to="/contact">Start a Project</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-black">
                <Link to="/portfolio">View Our Work</Link>
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