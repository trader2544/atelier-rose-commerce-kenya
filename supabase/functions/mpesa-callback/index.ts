
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const callbackData = await req.json()
    console.log('M-Pesa Callback Data:', JSON.stringify(callbackData, null, 2))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const stkCallback = callbackData.Body?.stkCallback
    
    if (!stkCallback) {
      console.error('Invalid callback data structure')
      return new Response('Invalid callback data', { status: 400 })
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const merchantRequestId = stkCallback.MerchantRequestID
    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc

    // Update transaction status
    const updateData: any = {
      result_code: resultCode,
      result_desc: resultDesc,
      callback_data: callbackData,
      updated_at: new Date().toISOString()
    }

    if (resultCode === 0) {
      // Payment successful
      updateData.status = 'completed'
      
      // Extract payment details
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || []
      const amountPaid = callbackMetadata.find((item: any) => item.Name === 'Amount')?.Value
      const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value
      const transactionDate = callbackMetadata.find((item: any) => item.Name === 'TransactionDate')?.Value
      const phoneNumber = callbackMetadata.find((item: any) => item.Name === 'PhoneNumber')?.Value

      updateData.amount_paid = amountPaid
      updateData.mpesa_receipt_number = mpesaReceiptNumber
      updateData.transaction_date = transactionDate
      updateData.phone_number = phoneNumber

      // Update the transaction record
      const { data: transaction, error: updateError } = await supabase
        .from('mpesa_transactions')
        .update(updateData)
        .eq('checkout_request_id', checkoutRequestId)
        .select('order_id')
        .single()

      if (updateError) {
        console.error('Error updating transaction:', updateError)
        throw updateError
      }

      // Update the order payment status
      if (transaction?.order_id) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('id', transaction.order_id)

        if (orderError) {
          console.error('Error updating order:', orderError)
        } else {
          console.log('Order payment status updated successfully')
        }
      }

    } else {
      // Payment failed
      updateData.status = 'failed'
      
      await supabase
        .from('mpesa_transactions')
        .update(updateData)
        .eq('checkout_request_id', checkoutRequestId)
    }

    console.log('Transaction updated successfully')

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
