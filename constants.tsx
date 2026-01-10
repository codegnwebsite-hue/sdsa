
export const APP_CONFIG = {
  OWNER_NAME: "Kishore Pro",
  DISCORD_INVITE: "https://discord.gg/your-server-invite",
  
  // Real short links for verification checkpoints
  CHECKPOINT_1_LINK: "https://link-hub.net/1322142/5t2U6wJPLrfQ", 
  CHECKPOINT_2_LINK: "https://link.pocolinks.com/BBwS4I",
  
  // Webhook and Secret
  DISCORD_WEBHOOK_URL: (import.meta as any).env?.VITE_DISCORD_WEBHOOK_URL || (process as any).env?.VITE_DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL_HERE",
  SERVER_NAME: "Elite Gaming Community",
  
  // Verification window in milliseconds (10 minutes)
  VERIFY_WINDOW_MS: 10 * 60 * 1000,

  // Use this for API validation
  API_SECRET: (import.meta as any).env?.VITE_API_SECRET || (process as any).env?.VITE_API_SECRET || "YOUR_SECRET_KEY"
};
