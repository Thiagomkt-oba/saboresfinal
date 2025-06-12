export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log("Webhook called with method:", req.method);
  console.log("Webhook headers:", JSON.stringify(req.headers, null, 2));

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests for webhook validation
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'webhook_active', 
      timestamp: new Date().toISOString() 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    console.log("For4Payments webhook received:", JSON.stringify(webhookData, null, 2));

    // Process different webhook events based on For4Payments documentation
    const eventType = webhookData.event || webhookData.type;
    const transactionStatus = webhookData.status;
    const paymentMethod = webhookData.method || webhookData.paymentMethod;

    console.log(`Processing event: ${eventType}, status: ${transactionStatus}, method: ${paymentMethod}`);

    // Handle approved PIX payments
    if ((transactionStatus === "APPROVED" || eventType === "onBuyApproved") && 
        (paymentMethod === "PIX" || paymentMethod === "pix")) {
      
      // Prepare Utmify order data for PIX paid
      const utmifyOrderData = {
        orderId: webhookData.id,
        platform: "SaboresDeMinas",
        paymentMethod: "pix",
        status: "paid",
        createdAt: webhookData.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
        approvedDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        refundedAt: null,
        customer: {
          name: webhookData.customer?.name || "Cliente",
          email: webhookData.customer?.email || "cliente@email.com",
          phone: webhookData.customer?.phone || null,
          document: webhookData.customer?.document || null,
          country: "BR",
          ip: req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || "127.0.0.1"
        },
        products: [{
          id: "conjunto-3-manteigas",
          name: "Conjunto 3 Manteigas Sabores de Minas",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: webhookData.amount || 6990
        }],
        trackingParameters: {
          src: null,
          sck: null,
          utm_source: null,
          utm_campaign: null,
          utm_medium: null,
          utm_content: null,
          utm_term: null
        },
        commission: {
          totalPriceInCents: webhookData.amount || 6990,
          gatewayFeeInCents: Math.round((webhookData.amount || 6990) * 0.05),
          userCommissionInCents: Math.round((webhookData.amount || 6990) * 0.95)
        },
        isTest: false
      };

      // Send PIX paid event to Utmify
      if (process.env.UTMIFY_API_TOKEN) {
        try {
          const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-token": process.env.UTMIFY_API_TOKEN
            },
            body: JSON.stringify(utmifyOrderData)
          });

          if (!utmifyResponse.ok) {
            console.error("Utmify API Error:", await utmifyResponse.text());
          } else {
            console.log("Payment confirmation sent to Utmify successfully");
          }
        } catch (error) {
          console.error("Error sending to Utmify:", error);
        }
      }
    }

    // Handle other events
    if (eventType === "onPixCreated") {
      console.log("PIX created event received for transaction:", webhookData.id);
    }

    if (eventType === "onRefound" || transactionStatus === "REFUNDED") {
      console.log("Refund event received for transaction:", webhookData.id);
    }

    if (eventType === "onChargeback" || transactionStatus === "CHARGEBACK") {
      console.log("Chargeback event received for transaction:", webhookData.id);
    }

    return res.status(200).json({ 
      received: true, 
      processed: true,
      event: eventType,
      status: transactionStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ 
      error: "Error processing webhook",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}