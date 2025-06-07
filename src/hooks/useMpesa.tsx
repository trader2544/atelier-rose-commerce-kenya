
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
      
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: request
      });

      if (error) {
        console.error('STK Push error:', error);
        throw new Error(error.message || 'Failed to initiate payment');
      }

      if (data.success) {
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
        throw new Error(data.error || 'Payment initiation failed');
      }

    } catch (error: any) {
      console.error('STK Push failed:', error);
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
      const { data, error } = await supabase
        .from('mpesa_transactions')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .single();

      if (error) {
        console.error('Payment status check error:', error);
        return { status: 'unknown', error: error.message };
      }

      return { status: data.status, data };
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
