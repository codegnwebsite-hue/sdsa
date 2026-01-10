
// Fix: Import Buffer explicitly to satisfy TypeScript type checking in Node.js environments
import { Buffer } from 'buffer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Extract and Clean Parameters
  const { uid, key, service = 'Verification', name = '', avatar = '', plan = 'Free' } = req.query;
  
  // Use the environment variable from Vercel
  const SYSTEM_SECRET = (process.env.VITE_API_SECRET || "YOUR_SECRET_KEY").trim();
  const PROVIDED_KEY = (key as string || "").trim();

  // 3. Security Check
  if (!PROVIDED_KEY || PROVIDED_KEY !== SYSTEM_SECRET) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Invalid API Key.",
      debug: {
        received_key: PROVIDED_KEY ? "EXISTS" : "MISSING",
        match: PROVIDED_KEY === SYSTEM_SECRET
      }
    });
  }

  // 4. User ID Check
  if (!uid) {
    return res.status(400).json({
      status: "error",
      message: "Missing 'uid' parameter."
    });
  }

  // 5. Generate Token
  const timestamp = Date.now();
  // Plan is inserted before avatar to avoid URL colon splitting issues in the decoder
  const dataString = `${uid}:${service}:${timestamp}:${name}:${plan}:${avatar}`;
  
  // Generate URL-safe base64 (replace + with - and / with _)
  const base64 = Buffer.from(dataString).toString('base64');
  const safeBase64 = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, ''); // Remove padding
    
  const token = `u_${safeBase64}`;
  
  // 6. Build Verification URL
  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  
  // Clean, standard URL for BrowserRouter
  const verificationUrl = `${protocol}://${host}/v/${token}`;

  // 7. Success Response
  return res.status(200).json({
    status: "success",
    data: {
      uid,
      service,
      plan,
      token,
      verification_url: verificationUrl
    }
  });
}
