
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatusHookProps {
  checkoutRequestId?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const usePaymentStatus = ({ checkoutRequestId, onSuccess, onFailure }: PaymentStatusHookProps) => {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'timeout'>('pending');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timeout

  useEffect(() => {
    if (!checkoutRequestId) return;

    let pollInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    // Start countdown
    timeoutInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('timeout');
          clearInterval(pollInterval);
          clearInterval(timeoutInterval);
          onFailure?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Poll for payment status
    pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('mpesa_transactions')
          .select('status')
          .eq('transaction_id', checkoutRequestId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking payment status:', error);
          return;
        }

        if (data?.status === 'completed') {
          setStatus('success');
          clearInterval(pollInterval);
          clearInterval(timeoutInterval);
          onSuccess?.();
        } else if (data?.status === 'failed') {
          setStatus('failed');
          clearInterval(pollInterval);
          clearInterval(timeoutInterval);
          onFailure?.();
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeoutInterval);
    };
  }, [checkoutRequestId, onSuccess, onFailure]);

  return { status, timeLeft };
};
