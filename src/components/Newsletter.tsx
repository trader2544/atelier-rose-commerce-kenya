
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully Subscribed! ✨",
        description: "Thank you for joining our newsletter. You'll receive updates about our latest collections.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4 sparkle-effect">
          Stay in Touch
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to know about our latest collections, exclusive offers, and styling tips for the modern elegant woman.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border-pink-200 focus:border-pink-400 bg-white/90"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-primary whitespace-nowrap"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe ✨'}
          </Button>
        </form>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <span className="sr-only">Instagram</span>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform">
              IG
            </div>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <span className="sr-only">Facebook</span>
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform">
              f
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
