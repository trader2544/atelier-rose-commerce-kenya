
export interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: any;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: DatabaseProduct;
}

export interface DatabaseMessage {
  id: string;
  user_id: string;
  admin_id: string | null;
  subject: string;
  content: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
  profile?: DatabaseProfile;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

// New inventory types
export interface DatabaseItem {
  item_id: string;
  item_code: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface DatabaseItemVariant {
  variant_id: string;
  item_id: string;
  variant_name: string;
  quantity: number;
  price: number;
  images: string[];
  created_at: string;
}

export interface ItemWithVariants extends DatabaseItem {
  variants: DatabaseItemVariant[];
}

// Extended types for admin components
export interface OrderWithItems extends DatabaseOrder {
  order_items: DatabaseOrderItem[];
  profiles?: DatabaseProfile;
}

export interface MessageWithProfile extends DatabaseMessage {
  profiles?: DatabaseProfile;
}
