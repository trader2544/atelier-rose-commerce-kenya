
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { ItemWithVariants } from '@/types/database';

interface InventoryCardProps {
  item: ItemWithVariants;
  onEdit: (item: ItemWithVariants) => void;
  onDelete: (itemId: string) => void;
  onView: (item: ItemWithVariants) => void;
}

const InventoryCard = ({ item, onEdit, onDelete, onView }: InventoryCardProps) => {
  const totalStock = item.variants.reduce((sum, variant) => sum + variant.quantity, 0);
  const minPrice = Math.min(...item.variants.map(v => v.price));
  const maxPrice = Math.max(...item.variants.map(v => v.price));
  const priceRange = minPrice === maxPrice ? `KSh ${minPrice}` : `KSh ${minPrice} - ${maxPrice}`;

  return (
    <Card className="glassmorphic hover:scale-105 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-gray-800 text-lg font-medium mb-1">
              {item.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{item.item_code}</p>
            <Badge className="bg-pink-100 text-pink-800 text-xs">
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
              onClick={() => onDelete(item.item_id)}
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
            <span className="text-sm text-gray-600">Price Range:</span>
            <span className="font-semibold text-pink-600">{priceRange}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Stock:</span>
            <Badge className={totalStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {totalStock} units
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Variants:</span>
            <span className="text-sm font-medium">{item.variants.length}</span>
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
