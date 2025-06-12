export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tests = [];
  const endpoint = "https://app.for4payments.com.br/api/v1/transaction.purchase";

  // Test 1: Check if API key is configured
  tests.push({
    test: "API Key Configuration",
    status: process.env.FOR4PAYMENTS_API_KEY ? "✅ PASS" : "❌ FAIL",
    details: process.env.FOR4PAYMENTS_API_KEY 
      ? `Configured (${process.env.FOR4PAYMENTS_API_KEY.length} chars)` 
      : "Not configured in environment variables"
  });

  // Test 2: Try minimal valid request
  if (process.env.FOR4PAYMENTS_API_KEY) {
    try {
      const testPayment = {
        name: "Teste API",
        email: "teste@teste.com",
        cpf: "12345678901",
        phone: "11999999999",
        paymentMethod: "PIX",
        amount: 500,
        traceable: true,
        items: [{
          unitPrice: 500,
          title: "Teste de Conectividade",
          quantity: 1,
          tangible: false
        }],
        externalId: `test_${Date.now()}`
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FOR4PAYMENTS_API_KEY
        },
        body: JSON.stringify(testPayment)
      });

      const responseText = await response.text();
      
      tests.push({
        test: "API Connection",
        status: response.ok ? "✅ PASS" : "❌ FAIL",
        details: `Status: ${response.status}, Response: ${responseText.substring(0, 200)}`
      });

      if (!response.ok) {
        let errorAnalysis = "Unknown error";
        
        try {
          const errorData = JSON.parse(responseText);
          errorAnalysis = `${errorData.code || 'ERROR'}: ${errorData.message || 'No message'}`;
        } catch (e) {
          errorAnalysis = responseText.length > 100 ? "HTML/Non-JSON response" : responseText;
        }

        tests.push({
          test: "Error Analysis",
          status: "ℹ️ INFO",
          details: errorAnalysis
        });

        if (response.status === 401) {
          tests.push({
            test: "Diagnosis",
            status: "🔍 ISSUE",
            details: "Authentication failed - Check if API key is correct and active"
          });
        } else if (response.status === 500) {
          tests.push({
            test: "Diagnosis",
            status: "🔍 ISSUE",
            details: "Server error - Account may not be approved or PIX not enabled"
          });
        } else if (response.status === 400) {
          tests.push({
            test: "Diagnosis",
            status: "🔍 ISSUE",
            details: "Bad request - Data validation failed"
          });
        }
      }

    } catch (error) {
      tests.push({
        test: "API Connection",
        status: "❌ FAIL",
        details: `Network error: ${error.message}`
      });
    }
  }

  // Test 3: Environment check
  tests.push({
    test: "Environment",
    status: "ℹ️ INFO",
    details: `Host: ${req.headers.host}, Deploy: Vercel`
  });

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    endpoint: endpoint,
    tests: tests,
    recommendations: [
      "Verify For4Payments account is active and approved",
      "Confirm PIX is enabled in your For4Payments account",
      "Check if API key is from production (not sandbox)",
      "Ensure account documents are validated",
      "Test with a different CPF if this one is blocked"
    ]
  });
}