import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Calendar, MapPin, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = ['All', 'Weddings', 'Events', 'Films', 'Branding', 'Merchandise'];

  const projects = [
    {
      id: 1,
      title: 'Royal Palace Wedding',
      category: 'Weddings',
      image: 'https://images.unsplash.com/photo-1669789748471-81548abdbe8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBzZXNzaW9ufGVufDF8fHx8MTc1NzU5ODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A grand celebration of love at the historic Royal Palace with traditional ceremonies and modern elegance.',
      client: 'Priya & Rahul',
      date: 'December 2023',
      location: 'Udaipur, Rajasthan',
      details: 'This three-day wedding celebration was a perfect blend of traditional Indian customs and contemporary style. We captured over 2000 moments, from intimate pre-wedding portraits to the grand finale reception.',
      gallery: [
        'https://images.unsplash.com/photo-1669789748471-81548abdbe8d?w=800',
        'https://images.unsplash.com/photo-1525772764200-be829854c18b?w=800',
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'
      ],
      tags: ['Photography', 'Cinematography', 'Traditional']
    },
    {
      id: 2,
      title: 'Tech Summit 2024',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1655828913505-9fb4193d4452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb24lMjBmaWxtaW5nfGVufDF8fHx8MTc1NzU5ODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Corporate event coverage for India\'s largest technology summit featuring keynotes, panels, and networking.',
      client: 'TechCorp India',
      date: 'November 2023',
      location: 'Mumbai, Maharashtra',
      details: 'A two-day technology summit with over 1000 attendees. We provided complete event coverage including live streaming, highlight reels, and social media content.',
      gallery: [
        'https://images.unsplash.com/photo-1655828913505-9fb4193d4452?w=800',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
      ],
      tags: ['Video Production', 'Live Streaming', 'Corporate']
    },
    {
      id: 3,
      title: 'Sustainable Fashion Campaign',
      category: 'Films',
      image: 'https://images.unsplash.com/photo-1682517254473-174fc5acec2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBtZXJjaGFuZGlzZSUyMGJyYW5kaW5nfGVufDF8fHx8MTc1NzU5ODg5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Documentary-style campaign film promoting sustainable fashion practices and eco-conscious lifestyle choices.',
      client: 'EcoFashion Co.',
      date: 'October 2023',
      location: 'Bangalore, Karnataka',
      details: 'A powerful 5-minute documentary highlighting the importance of sustainable fashion. Shot across multiple locations with natural lighting and authentic storytelling.',
      gallery: [
        'https://images.unsplash.com/photo-1682517254473-174fc5acec2b?w=800',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'
      ],
      tags: ['Documentary', 'Sustainability', 'Campaign']
    },
    {
      id: 4,
      title: 'Artisan Coffee Brand Identity',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDk2MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Complete brand identity design for a premium artisan coffee company including logo, packaging, and digital presence.',
      client: 'Brew Masters',
      date: 'September 2023',
      location: 'Delhi, India',
      details: 'A comprehensive branding project that included logo design, packaging design, website development, and social media strategy for a boutique coffee roastery.',
      gallery: [
        'https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?w=800',
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
      ],
      tags: ['Logo Design', 'Packaging', 'Digital Strategy']
    },
    {
      id: 5,
      title: 'University Merchandise Collection',
      category: 'Merchandise',
      image: 'https://images.unsplash.com/photo-1682517254473-174fc5acec2b?w=800',
      description: 'Custom merchandise design and production for a prestigious university\'s centenary celebration.',
      client: 'St. Xavier\'s University',
      date: 'August 2023',
      location: 'Kolkata, West Bengal',
      details: 'Designed and produced a complete merchandise collection including apparel, accessories, and commemorative items for the university\'s 100-year celebration.',
      gallery: [
        'https://images.unsplash.com/photo-1682517254473-174fc5acec2b?w=800',
        'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800',
        'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'
      ],
      tags: ['Custom Design', 'Apparel', 'Commemoration']
    },
    {
      id: 6,
      title: 'Destination Wedding Goa',
      category: 'Weddings',
      image: 'https://images.unsplash.com/photo-1525772764200-be829854c18b?w=800',
      description: 'Beach wedding celebration with sunset ceremonies and tropical luxury at a premium resort in Goa.',
      client: 'Arjun & Kavya',
      date: 'July 2023',
      location: 'Goa, India',
      details: 'A beautiful beach wedding with golden hour ceremonies, traditional rituals against ocean backdrop, and elegant reception under the stars.',
      gallery: [
        'https://images.unsplash.com/photo-1525772764200-be829854c18b?w=800',
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'
      ],
      tags: ['Beach Wedding', 'Destination', 'Luxury']
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDk2MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Portfolio"
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
              Our Work
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              A showcase of our finest creative projects across all verticals
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`${
                  activeFilter === filter 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
                    : 'border-gray-600 text-gray-300 hover:text-white hover:border-blue-500'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-900">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge 
                        variant="secondary" 
                        className="mb-3 bg-blue-600/80 text-white border-0"
                      >
                        {project.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <ExternalLink size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Case Study Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          {selectedProject && (
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-blue-600 text-white border-0">
                    {selectedProject.category}
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User size={16} className="text-blue-400" />
                  <span className="text-sm">{selectedProject.client}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar size={16} className="text-blue-400" />
                  <span className="text-sm">{selectedProject.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin size={16} className="text-blue-400" />
                  <span className="text-sm">{selectedProject.location}</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
                <p className="text-gray-300 leading-relaxed">{selectedProject.details}</p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedProject.gallery.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`${selectedProject.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with our creative expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/contact">Get In Touch</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/services">View Services</Link>
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