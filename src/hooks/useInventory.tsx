
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseItem, DatabaseItemVariant, ItemWithVariants } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export const useInventory = () => {
  const [items, setItems] = useState<ItemWithVariants[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Fetch items with their variants
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select(`
          *,
          item_variants (*)
        `)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      const itemsWithVariants: ItemWithVariants[] = itemsData.map((item: any) => ({
        ...item,
        variants: item.item_variants || []
      }));

      setItems(itemsWithVariants);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData: Omit<DatabaseItem, 'item_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added successfully",
      });

      fetchItems();
      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (itemId: string, itemData: Partial<DatabaseItem>) => {
    try {
      const { error } = await supabase
        .from('items')
        .update(itemData)
        .eq('item_id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('item_id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addVariant = async (variantData: Omit<DatabaseItemVariant, 'variant_id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('item_variants')
        .insert([variantData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant added successfully",
      });

      fetchItems();
    } catch (error) {
      console.error('Error adding variant:', error);
      toast({
        title: "Error",
        description: "Failed to add variant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateVariant = async (variantId: string, variantData: Partial<DatabaseItemVariant>) => {
    try {
      const { error } = await supabase
        .from('item_variants')
        .update(variantData)
        .eq('variant_id', variantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant updated successfully",
      });

      fetchItems();
    } catch (error) {
      console.error('Error updating variant:', error);
      toast({
        title: "Error",
        description: "Failed to update variant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('item_variants')
        .delete()
        .eq('variant_id', variantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variant deleted successfully",
      });

      fetchItems();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    addVariant,
    updateVariant,
    deleteVariant,
  };
};
