
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
            Contact <span className="text-pink-600">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glassmorphic p-8">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Visit Us</h3>
                    <p className="text-gray-600">Kisumu, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Call Us</h3>
                    <p className="text-gray-600">+254 745 242 174</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email Us</h3>
                    <p className="text-gray-600">elsokisumu@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Business Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glassmorphic p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Why Choose ELSO?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Authentic luxury products</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Fast and reliable delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Exceptional customer service</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>30-day return policy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glassmorphic p-8">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white/70 border-pink-200 focus:border-pink-400"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white/70 border-pink-200 focus:border-pink-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="bg-white/70 border-pink-200 focus:border-pink-400"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="bg-white/70 border-pink-200 focus:border-pink-400"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
