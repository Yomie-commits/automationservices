/* =========================================================
   APP SETTINGS
   ---------------------------------------------------------
   aiEndpoint: your Make.com webhook that runs the
   "EA - Website demo: live AI email analysis" scenario
   (Custom webhook → Make AI "Ask" → Webhook response).
   It is used ONLY on the "Analyse an email" page, when the
   visitor chooses "Live AI" — each run uses your Make credits.

   - Leave aiEndpoint "" to switch live AI off completely.
   - aiDailyLimit caps live analyses per visitor per day.
   - If the scenario is off or the call fails, the app falls
     back to the demonstration engine and says so.
   Never put an AI API key in this file — it is public.
   ========================================================= */
window.APP_CONFIG = {
  aiEndpoint: "https://hook.eu1.make.com/x81r7j67fxkidhaaoma3xkk0anopiwr6",
  aiEndpointLabel: "Live AI via Make.com",
  aiDailyLimit: 8,
  aiTimeoutSeconds: 60,
  websiteUrl: "../index.html",
  contactUrl: "../contact.html#consultation"
};
