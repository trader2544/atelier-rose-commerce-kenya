
import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Rose Gold Elegant Handbag',
    price: 8500,
    originalPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Luxurious rose gold handbag crafted with premium leather. Perfect for elegant evenings and special occasions.',
    category: 'Handbags',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Pearl Drop Earrings',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Delicate pearl drop earrings that add a touch of sophistication to any outfit.',
    category: 'Jewelry',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Silk Blush Scarf',
    price: 2800,
    originalPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Soft silk scarf in beautiful blush tones. Versatile accessory for any season.',
    category: 'Accessories',
    inStock: true,
    rating: 4.7,
    reviews: 67
  },
  {
    id: '4',
    name: 'Diamond Rose Ring',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Exquisite diamond ring with rose gold setting. A timeless piece for special moments.',
    category: 'Jewelry',
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 156
  },
  {
    id: '5',
    name: 'Leather Crossbody Bag',
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Stylish crossbody bag in premium leather. Perfect for everyday elegance.',
    category: 'Handbags',
    inStock: true,
    rating: 4.6,
    reviews: 93
  },
  {
    id: '6',
    name: 'Gold Chain Necklace',
    price: 4200,
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Delicate gold chain necklace that complements any neckline beautifully.',
    category: 'Jewelry',
    inStock: false,
    rating: 4.8,
    reviews: 78
  }
];

export const categories = [
  'All',
  'Handbags',
  'Jewelry',
  'Accessories',
  'Clothing'
];
