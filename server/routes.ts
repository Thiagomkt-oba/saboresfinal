import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Function to send sale data to Utmify
  const sendToUtmify = async (orderData: any) => {
    try {
      const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": process.env.UTMIFY_API_TOKEN || ""
        },
        body: JSON.stringify(orderData)
      });

      if (!utmifyResponse.ok) {
        const errorText = await utmifyResponse.text();
        console.error("Utmify API Error:", errorText);
      } else {
        console.log("Sale data sent to Utmify successfully");
      }
    } catch (error) {
      console.error("Error sending to Utmify:", error);
    }
  };

  // PIX Payment endpoint
  app.post("/api/create-pix-payment", async (req, res) => {
    try {
      const {
        nome,
        cpf,
        email,
        telefone,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento,
        items,
        amount
      } = req.body;

      // Validate required fields
      if (!nome || !cpf || !email || !telefone || !amount) {
        return res.status(400).json({
          error: "Campos obrigatórios: nome, cpf, email, telefone, amount"
        });
      }

      // Clean CPF (remove dots and dashes)
      const cleanCpf = cpf.replace(/[.-]/g, '');
      
      // Clean phone number (remove non-digits)
      const cleanPhone = telefone.replace(/\D/g, '');

      // Prepare payment data for For4Payments API
      const paymentData = {
        name: nome,
        email: email,
        cpf: cleanCpf,
        phone: cleanPhone,
        paymentMethod: "PIX",
        amount: Math.round(amount * 100), // Convert to cents
        traceable: true,
        items: items || [{
          unitPrice: Math.round(amount * 100),
          title: "Produto",
          quantity: 1,
          tangible: false
        }],
        // Address fields (optional for PIX)
        cep: cep || null,
        street: logradouro || null,
        number: numero || null,
        district: bairro || null,
        city: cidade || null,
        state: estado || null,
        complement: complemento || null,
        externalId: `order_${Date.now()}`,
        postbackUrl: null
      };

      // Call For4Payments API
      const response = await fetch("https://app.for4payments.com.br/api/v1/transaction.purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FOR4PAYMENTS_API_KEY || ""
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("For4Payments API Error:", errorData);
        return res.status(400).json({
          error: "Erro ao processar pagamento",
          details: errorData
        });
      }

      const pixData = await response.json();

      // Prepare Utmify order data for PIX generated (waiting payment)
      const utmifyOrderData = {
        orderId: pixData.id,
        platform: "SaboresDeMinas",
        paymentMethod: "pix",
        status: "waiting_payment",
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        approvedDate: null,
        refundedAt: null,
        customer: {
          name: nome,
          email: email,
          phone: cleanPhone,
          document: cleanCpf,
          country: "BR",
          ip: req.ip || null
        },
        products: [
          {
            id: "conjunto-3-manteigas",
            name: "Conjunto 3 Manteigas Sabores de Minas",
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: Math.round(amount * 100)
          }
        ],
        trackingParameters: {
          src: null,
          sck: null,
          utm_source: req.query.utm_source || null,
          utm_campaign: req.query.utm_campaign || null,
          utm_medium: req.query.utm_medium || null,
          utm_content: req.query.utm_content || null,
          utm_term: req.query.utm_term || null
        },
        commission: {
          totalPriceInCents: Math.round(amount * 100),
          gatewayFeeInCents: Math.round(amount * 100 * 0.05), // 5% gateway fee
          userCommissionInCents: Math.round(amount * 100 * 0.95) // 95% to user
        },
        isTest: false
      };

      // Send PIX generated event to Utmify
      await sendToUtmify(utmifyOrderData);

      // Return PIX data to frontend
      res.json({
        transactionId: pixData.id,
        pixQrCode: pixData.pixQrCode,
        pixCode: pixData.pixCode,
        amount: amount,
        expiresAt: pixData.expiresAt,
        status: pixData.status
      });

    } catch (error) {
      console.error("Error creating PIX payment:", error);
      res.status(500).json({
        error: "Erro interno do servidor"
      });
    }
  });

  // Webhook endpoint to receive For4Payments notifications
  app.post("/api/webhook/for4payments", async (req, res) => {
    try {
      const webhookData = req.body;
      console.log("For4Payments webhook received:", webhookData);

      // Check if it's a PIX payment confirmation
      if (webhookData.status === "APPROVED" && webhookData.paymentMethod === "PIX") {
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
            ip: null
          },
          products: [
            {
              id: "conjunto-3-manteigas",
              name: "Conjunto 3 Manteigas Sabores de Minas",
              planId: null,
              planName: null,
              quantity: 1,
              priceInCents: webhookData.amount || 6990
            }
          ],
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
        await sendToUtmify(utmifyOrderData);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Error processing webhook" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
