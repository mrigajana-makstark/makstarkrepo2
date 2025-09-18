import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e :  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', service: '', message: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick response via WhatsApp',
      value: '+91 98765 43210',
      action: () => {
        const phoneNumber = '+919876543210';
        const message = 'Hi! I would like to know more about Mak Stark services.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      },
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a detailed email',
      value: 'hello@makstark.com',
      action: () => {
        window.location.href = 'mailto:hello@makstark.com?subject=Project Inquiry';
      },
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call us directly',
      value: '+91 98765 43210',
      action: () => {
        window.location.href = 'tel:+919876543210';
      },
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Office Location',
      value: 'Haldia, West Bengal, India'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon - Sat: 9:00 AM - 7:00 PM'
    },
    {
      icon: Users,
      title: 'Team Size',
      value: '15+ Creative Professionals'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTc1OTQ5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Contact Us"
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
              Let's Build Something Iconic Together
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Ready to bring your vision to life? Get in touch with our creative team today.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Contact Buttons */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Get In Touch Instantly</h2>
            <p className="text-gray-400">Choose your preferred way to connect with us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={method.action}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
                    <CardContent className="p-8 text-center">
                      <div className={`bg-gradient-to-r ${method.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                      <p className="text-gray-400 mb-4">{method.description}</p>
                      <p className="text-blue-400 font-semibold">{method.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Send us a message</CardTitle>
                  <p className="text-gray-400">Fill out the form below and we'll get back to you within 24 hours.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="service" className="text-white">Service Interested</Label>
                      <Select value={formData.service} onValueChange={(value : string) => handleInputChange('service', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio (Wedding Photography)</SelectItem>
                          <SelectItem value="production">Production (Video & Events)</SelectItem>
                          <SelectItem value="customs">Customs (Merchandise)</SelectItem>
                          <SelectItem value="creative-agency">Creative Agency (Digital Solutions)</SelectItem>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your project..."
                        required
                        rows={5}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message <Send size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Office Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Our Office</h3>
                <div className="space-y-6">
                  {officeInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={info.title} className="flex items-start space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                          <IconComponent size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">{info.title}</h4>
                          <p className="text-gray-400">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Find Us</h3>
                <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={48} className="text-blue-400 mx-auto mb-4" />
                      <p className="text-white font-semibold">Haldia, West Bengal</p>
                      <p className="text-gray-400 text-sm">Interactive map coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Mak Stark?</h3>
                <ul className="space-y-3">
                  {[
                    'Professional team with 4+ years experience',
                    'Comprehensive creative solutions under one roof',
                    'Youth-centric approach with modern techniques',
                    'Competitive pricing with premium quality',
                    '24/7 customer support throughout project',
                    'Fast turnaround times without compromising quality'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Get quick answers to common questions</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'What services does Mak Stark offer?',
                answer: 'We offer four main services: Studio (wedding photography & cinematography), Production (video production & events), Customs (branded merchandise), and Creative Agency (digital marketing & branding).'
              },
              {
                question: 'How far in advance should I book your services?',
                answer: 'For weddings and major events, we recommend booking 3-6 months in advance. For other services, 2-4 weeks notice is usually sufficient, but we can accommodate rush projects when possible.'
              },
              {
                question: 'Do you travel for destination weddings and events?',
                answer: 'Yes! We love destination projects. Travel costs and accommodations are typically added to the package, and we provide detailed quotes for out-of-town events.'
              },
              {
                question: 'What is your typical turnaround time for deliverables?',
                answer: 'Wedding photos: 4-6 weeks, Event videos: 2-3 weeks, Merchandise: 1-2 weeks, Digital campaigns: 1-2 weeks. Rush delivery is available for additional charges.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}  
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </CardContent>
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
              Ready to Start Your Creative Journey?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Don't wait - let's discuss your project today and turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => {
                  const phoneNumber = '+919876543210';
                  const message = 'Hi! I would like to discuss a project with Mak Stark.';
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle size={16} className="mr-2" />
                WhatsApp Us Now
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
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