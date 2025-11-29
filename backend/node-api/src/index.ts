import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();
const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pinecone = new Pinecone({
  apiKey: "pcsk_3PH6r_4Rd2jk4kB2swiTkzX8vRWvsiPBgZDpexBNAD2gEJWehhPZLys9bGLS5tQMrhFjh",
});

const index = pinecone.index("missinformation2");

const N8N_WEBHOOK_URL =
  "https://atharva4spam.app.n8n.cloud/webhook/misinformation-check/";

app.get("/", (_: any, res: any) =>
  res.send("Miss.Information backend running")
);

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    console.log("📩 Received from Extension:", req.body);

    const message = req.body.text;
    const location = req.body.location;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "No text provided" });
    }

    const finalUrl = `${N8N_WEBHOOK_URL}?message=${encodeURIComponent(
      message
    )}&latitude=${encodeURIComponent(
      location?.lat || ""
    )}&longitude=${encodeURIComponent(location?.lng || "")}`;

    console.log("➡️ Calling n8n webhook:", finalUrl);

    const n8nResponse = await axios.post(finalUrl);
    console.log("✅ n8n response received:", n8nResponse.data);               

    return res.status(200).json({
      success: true,
      fromN8n: n8nResponse.data,
    });
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to n8n",
      error: err.response?.data || err.message,
    });
  }
});

app.get("/history", async (req: Request, res: Response) => {
  try {
    // Get limit from query params, default to 30
    const limit = parseInt(req.query.limit as string) || 30;
    console.log(`📥 Fetching up to ${limit} records...`);
    
    // Query to get IDs
    const queryResults = await index.query({
      topK: Math.min(limit, 100), // Limit the query
      id: "1763804225646-tnuhss",
      includeMetadata: false, // Don't include metadata in query to save bandwidth
    });

    const ids = queryResults.matches.slice(0, limit).map((m) => m.id);
    console.log(`🔍 Found ${ids.length} IDs`);

    if (ids.length === 0) {
      console.log("⚠️ No records found");
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Fetch metadata for those IDs
    console.log("📦 Fetching metadata...");
    const fetchResult = await index.fetch(ids);
    
    // Format the response with only necessary fields
    const formatted = Object.values(fetchResult.records).map((rec: any) => ({
      id: rec.id,
      claim: rec.metadata?.claim || 'No claim',
      device_latitude: rec.metadata?.device_latitude || '',
      device_longitude: rec.metadata?.device_longitude || '',
      region_name: rec.metadata?.region_name || 'Unknown',
      type: rec.metadata?.type || 'general',
      verified_on: rec.metadata?.verified_on || new Date().toISOString(),
      count: rec.metadata?.count || 1,
      status: rec.metadata?.status || false,
    }));

    console.log(`✅ Returning ${formatted.length} items`);
    
    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
    
  } catch (error: any) {
    console.error("❌ Pinecone History Error:", error);
    console.error("❌ Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      error: error.message,
      data: [],
    });
  }
});

//sus working code
// app.get("/history", async (req: Request, res: Response) => {
//   try {
//     console.log("📥 Fetching full data...");
//     const fetchResult = await index.fetch([
//        "1763804225646-tnuhss",
//         "1763804578486-khudnj",
//     ]);
//     // console.log("✅ Fetch successful:", fetchResult);
//     const formatted = Object.values(fetchResult.records).map((rec: any) => ({
//       id: rec.id,
//       ...rec.metadata, // spread metadata fields
//     }));

//     console.log(formatted);
//   } catch (error: any) {
//     console.error("❌ Pinecone Fetch Error:", error);

//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// app.get("/history", async (req: Request, res: Response) => {
//   try {
//     console.log("📥 Fetching vector IDs...");

//     // Step 1: Query to get all IDs (use any known ID as anchor)
//     const queryResults = await index.query({
//       topK: 5,
//       id: "1763804225646-tnuhss", // seed ID
//     });

//     const ids = queryResults.matches.map((m) => m.id);
//     console.log("🔍 Found IDs:", ids.length);

//     if (ids.length === 0) {
//       return res.json({ success: true, data: [] });
//     }

//     // Step 2: Fetch vector metadata using IDs
//     console.log("📦 Fetching metadata for IDs...");
//     const fetchResult = await index.fetch(ids);

//     // Step 3: Format clean response
//     const formatted = Object.values(fetchResult.records).map((rec: any) => ({
//       id: rec.id,
//       ...rec.metadata, // includes claim, complete_answer, etc.
//     }));

//     console.log(`Returning ${formatted.length} items`);

//     return res.status(200).json({
//       success: true,
//       count: formatted.length,
//       data: formatted,
//     });
//   } catch (error: any) {
//     console.error("❌ Pinecone History Error:", error);

//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });


app.listen(8000, () => {
  console.log("✅ Backend running on http://localhost:8000");
  console.log("✅ CORS enabled for frontend");
});