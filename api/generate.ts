
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
  const { uid, key, service = 'Verification' } = req.query;
  
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
  // Node.js has Buffer built-in, no need to import from esm.sh
  const timestamp = Date.now();
  const dataString = `${uid}:${service}:${timestamp}`;
  const token = `u_${Buffer.from(dataString).toString('base64').replace(/=/g, '')}`;
  
  // 6. Build Verification URL
  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const verificationUrl = `${protocol}://${host}/v/${token}`;

  // 7. Success Response
  return res.status(200).json({
    status: "success",
    data: {
      uid,
      service,
      token,
      verification_url: verificationUrl
    }
  });
}
