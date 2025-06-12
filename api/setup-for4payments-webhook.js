export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.FOR4PAYMENTS_API_KEY) {
      return res.status(500).json({
        error: "FOR4PAYMENTS_API_KEY não configurada"
      });
    }

    const webhookData = {
      callbackUrl: `https://${req.headers.host}/api/webhook-for4payments`,
      name: "SaboresDeMinas Webhook",
      onBuyApproved: true,
      onRefound: true,
      onChargeback: true,
      onPixCreated: true
    };

    console.log("Creating For4Payments webhook:", webhookData);

    const response = await fetch("https://app.for4payments.com.br/api/v1/webhook.create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.FOR4PAYMENTS_API_KEY
      },
      body: JSON.stringify(webhookData)
    });

    const responseText = await response.text();
    console.log("For4Payments webhook response status:", response.status);
    console.log("For4Payments webhook response body:", responseText);

    if (!response.ok) {
      console.error("Webhook creation failed with status:", response.status);
      console.error("Error response:", responseText);
      
      return res.status(response.status).json({
        error: "Erro ao criar webhook",
        status: response.status,
        details: responseText,
        troubleshooting: "Verifique se a conta For4Payments está ativa e com permissões para criar webhooks"
      });
    }

    const result = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      message: "Webhook configurado com sucesso",
      webhookUrl: webhookData.callbackUrl,
      events: ["onBuyApproved", "onRefound", "onChargeback", "onPixCreated"],
      result: result
    });

  } catch (error) {
    console.error("Error setting up webhook:", error);
    return res.status(500).json({
      error: "Erro interno",
      details: error.message
    });
  }
}