/* =========================================================
   APP SETTINGS
   ---------------------------------------------------------
   aiEndpoint: leave EMPTY to use the built-in demonstration
   engine (rule-based, runs in the visitor's browser, clearly
   labelled in the interface).

   To use a real AI model, point this at YOUR OWN server-side
   endpoint (e.g. a Make.com webhook scenario or a serverless
   function) that calls the AI provider. It receives a POST with
   JSON { from, email, subject, body } and should return JSON in
   the same shape as the demo engine's analysis (see README).
   Never put an AI API key in this file — it would be public.
   ========================================================= */
window.APP_CONFIG = {
  aiEndpoint: "",
  aiEndpointLabel: "Make.com + AI model",
  websiteUrl: "../index.html",
  contactUrl: "../contact.html#consultation"
};
