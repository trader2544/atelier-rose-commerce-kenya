
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface STKPushRequest {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
  transactionDesc: string;
}

export const useMpesa = () => {
  const [loading, setLoading] = useState(false);

  const initiateSTKPush = async (request: STKPushRequest) => {
    try {
      setLoading(true);
      console.log('Initiating STK Push:', request);
      
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: request
      });

      console.log('STK Push response:', data, error);

      if (error) {
        console.error('STK Push error:', error);
        
        // Show specific error toast for failed payments
        toast({
          title: "Payment Failed",
          description: "M-Pesa payment could not be initiated. Please check your phone number and try again.",
          variant: "destructive",
        });
        
        throw new Error(error.message || 'Failed to initiate payment');
      }

      if (data && data.success) {
        toast({
          title: "Payment Request Sent",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
        });
        
        return {
          success: true,
          checkoutRequestId: data.checkoutRequestId,
          merchantRequestId: data.merchantRequestId
        };
      } else {
        // Handle case where data exists but success is false
        const errorMessage = data?.error || 'Payment initiation failed';
        console.error('Payment failed:', errorMessage);
        
        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('STK Push failed:', error);
      
      // Show user-friendly error notification
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate M-Pesa payment. Please try again.",
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (checkoutRequestId: string) => {
    try {
      // Query the mpesa_transactions table to check status
      const { data, error } = await supabase
        .from('mpesa_transactions')
        .select('status')
        .eq('transaction_id', checkoutRequestId)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return { status: 'unknown', error: error.message };
      }

      return { status: data?.status || 'pending' };
    } catch (error: any) {
      console.error('Payment status check failed:', error);
      return { status: 'unknown', error: error.message };
    }
  };

  return {
    initiateSTKPush,
    checkPaymentStatus,
    loading
  };
};
