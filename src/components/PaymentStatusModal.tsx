
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutRequestId?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

const PaymentStatusModal = ({ 
  isOpen, 
  onClose, 
  checkoutRequestId, 
  onSuccess, 
  onFailure 
}: PaymentStatusModalProps) => {
  const { status, timeLeft } = usePaymentStatus({
    checkoutRequestId,
    onSuccess,
    onFailure
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
          title: 'Waiting for Payment',
          message: 'Please check your phone and enter your M-Pesa PIN to complete the payment.',
          timeMessage: `Time remaining: ${formatTime(timeLeft)}`
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. Your order has been confirmed.',
          timeMessage: null
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or use a different payment method.',
          timeMessage: null
        };
      case 'timeout':
        return {
          icon: <Clock className="h-16 w-16 text-orange-500" />,
          title: 'Payment Timeout',
          message: 'The payment request has timed out. Please try again.',
          timeMessage: null
        };
      default:
        return {
          icon: <Loader2 className="h-16 w-16 text-gray-500" />,
          title: 'Processing...',
          message: 'Please wait while we process your request.',
          timeMessage: null
        };
    }
  };

  const { icon, title, message, timeMessage } = getStatusContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Payment Status</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-6">
          {icon}
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
            {timeMessage && (
              <p className="text-blue-600 font-mono text-sm">{timeMessage}</p>
            )}
          </div>

          {(status === 'success' || status === 'failed' || status === 'timeout') && (
            <Button 
              onClick={onClose}
              className="mt-4"
              variant={status === 'success' ? 'default' : 'outline'}
            >
              {status === 'success' ? 'Continue' : 'Try Again'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentStatusModal;
