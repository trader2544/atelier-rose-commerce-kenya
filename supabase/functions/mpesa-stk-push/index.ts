
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface STKPushRequest {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
  transactionDesc: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, amount, orderId, accountReference, transactionDesc }: STKPushRequest = await req.json()
    console.log('STK Push request:', { phone, amount, orderId, accountReference, transactionDesc })

    // Get environment variables
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const businessShortCode = Deno.env.get('MPESA_BUSINESS_SHORTCODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')
    const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL')

    console.log('Environment check:', {
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      hasBusinessShortCode: !!businessShortCode,
      hasPasskey: !!passkey,
      hasCallbackUrl: !!callbackUrl
    })

    if (!consumerKey || !consumerSecret || !businessShortCode || !passkey || !callbackUrl) {
      const missingVars = []
      if (!consumerKey) missingVars.push('MPESA_CONSUMER_KEY')
      if (!consumerSecret) missingVars.push('MPESA_CONSUMER_SECRET')
      if (!businessShortCode) missingVars.push('MPESA_BUSINESS_SHORTCODE')
      if (!passkey) missingVars.push('MPESA_PASSKEY')
      if (!callbackUrl) missingVars.push('MPESA_CALLBACK_URL')
      
      throw new Error(`Missing M-Pesa configuration: ${missingVars.join(', ')}`)
    }

    // Step 1: Get access token
    console.log('Getting access token...')
    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token response error:', errorText)
      throw new Error(`Failed to get access token: ${tokenResponse.status} ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)
    const accessToken = tokenData.access_token

    if (!accessToken) {
      throw new Error('No access token received from M-Pesa API')
    }

    // Step 2: Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = btoa(`${businessShortCode}${passkey}${timestamp}`)

    // Step 3: Format phone number
    let formattedPhone = phone.replace(/\s+/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.slice(1)}`
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.slice(1)
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = `254${formattedPhone}`
    }

    console.log('Formatted phone:', formattedPhone)

    // Step 4: Prepare STK Push request
    const stkPushData = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    }

    console.log('STK Push data:', stkPushData)

    // Step 5: Send STK Push request
    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    })

    const stkResult = await stkResponse.json()
    console.log('STK Push response:', stkResult)

    if (stkResult.ResponseCode === '0') {
      // Success - store transaction details
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabase
        .from('mpesa_transactions')
        .insert({
          transaction_id: stkResult.CheckoutRequestID,
          phone_number: formattedPhone,
          amount: amount,
          status: 'pending'
        })

      return new Response(
        JSON.stringify({
          success: true,
          message: 'STK Push sent successfully',
          checkoutRequestId: stkResult.CheckoutRequestID,
          merchantRequestId: stkResult.MerchantRequestID
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      console.error('STK Push failed:', stkResult)
      throw new Error(stkResult.errorMessage || stkResult.ResponseDescription || 'STK Push failed')
    }

  } catch (error) {
    console.error('STK Push error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
