
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { DatabaseProduct } from '@/types/database';

interface InventoryCardProps {
  item: DatabaseProduct;
  onEdit: (item: DatabaseProduct) => void;
  onDelete: (itemId: string) => void;
  onView: (item: DatabaseProduct) => void;
}

const InventoryCard = ({ item, onEdit, onDelete, onView }: InventoryCardProps) => {
  return (
    <Card className="glassmorphic hover:scale-105 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-gray-800 text-lg font-medium mb-1">
              {item.name}
            </CardTitle>
            <Badge className="bg-pink-100 text-pink-800 text-xs mb-2">
              {item.category}
            </Badge>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(item)}
              className="h-8 w-8 p-0 hover:bg-pink-100"
            >
              <Eye className="h-4 w-4 text-pink-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="font-semibold text-pink-600">KSh {item.price.toLocaleString()}</span>
          </div>
          
          {item.original_price && item.original_price > item.price && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Original Price:</span>
              <span className="text-sm text-gray-500 line-through">KSh {item.original_price.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock:</span>
            <Badge className={item.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {item.in_stock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Featured:</span>
            <Badge className={item.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
              {item.featured ? 'Yes' : 'No'}
            </Badge>
          </div>

          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-2">
              {item.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
