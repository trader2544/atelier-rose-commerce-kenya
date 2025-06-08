
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
    const resultCode = stkCallback.ResultCode

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || []
      const amountPaid = callbackMetadata.find((item: any) => item.Name === 'Amount')?.Value
      const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value

      // Update transaction status
      await supabase
        .from('mpesa_transactions')
        .update({ 
          status: 'completed',
          transaction_id: mpesaReceiptNumber || checkoutRequestId
        })
        .eq('transaction_id', checkoutRequestId)

      console.log('Transaction completed successfully')
    } else {
      // Payment failed
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'failed' })
        .eq('transaction_id', checkoutRequestId)

      console.log('Transaction failed')
    }

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
