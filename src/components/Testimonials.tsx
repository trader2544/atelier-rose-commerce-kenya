
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Grace Wanjiku",
    location: "Nairobi",
    text: "ELSO has the most beautiful handbags! Quality is amazing and delivery was so fast.",
    rating: 5
  },
  {
    name: "Faith Achieng",
    location: "Kisumu", 
    text: "Love my new earrings from ELSO. They match perfectly with everything I wear!",
    rating: 5
  },
  {
    name: "Mary Njeri",
    location: "Mombasa",
    text: "The jewelry collection is stunning. Camillah has excellent taste in fashion.",
    rating: 5
  },
  {
    name: "Sarah Wambui",
    location: "Nakuru",
    text: "Ordered a necklace and bracelet set. Absolutely gorgeous and great value!",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-pink-50/50 to-purple-50/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-3 sm:mb-4">What Our Customers Say</h2>
          <p className="text-lg sm:text-xl text-gray-600">Real reviews from satisfied customers across Kenya</p>
        </div>

        {/* Mobile: Scrolling testimonials */}
        <div className="block sm:hidden overflow-hidden">
          <div className="flex animate-scroll">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} className="flex-shrink-0 w-72 mx-2 luxury-card">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-pink-400 text-pink-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">"{testimonial.text}"</p>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="luxury-card card-hover">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-pink-400 text-pink-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-3 sm:mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
