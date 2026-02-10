import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================================================
// Health Check
// ============================================================================

app.get("/make-server-554cbc7a/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================================
// Prompts CRUD
// ============================================================================

app.get("/make-server-554cbc7a/prompts", async (c) => {
  try {
    const data = await kv.get("prompts");
    return c.json({ prompts: data || [] });
  } catch (e) {
    console.log("Error fetching prompts:", e);
    return c.json({ error: e instanceof Error ? e.message : "Unknown error fetching prompts" }, 500);
  }
});

app.post("/make-server-554cbc7a/prompts", async (c) => {
  try {
    const { prompts } = await c.req.json();
    await kv.set("prompts", prompts);
    return c.json({ success: true });
  } catch (e) {
    console.log("Error saving prompts:", e);
    return c.json({ error: e instanceof Error ? e.message : "Unknown error saving prompts" }, 500);
  }
});

// ============================================================================
// Custom Rules (Smart Paste regex rules — persisted per-app)
// ============================================================================

app.get("/make-server-554cbc7a/custom-rules", async (c) => {
  try {
    const data = await kv.get("custom-rules");
    return c.json({ rules: data || [] });
  } catch (e) {
    console.log("Error fetching custom rules:", e);
    return c.json({ error: e instanceof Error ? e.message : "Unknown error fetching custom rules" }, 500);
  }
});

app.post("/make-server-554cbc7a/custom-rules", async (c) => {
  try {
    const { rules } = await c.req.json();
    if (!Array.isArray(rules)) {
      return c.json({ error: "Invalid payload: rules must be an array" }, 400);
    }
    await kv.set("custom-rules", rules);
    return c.json({ success: true });
  } catch (e) {
    console.log("Error saving custom rules:", e);
    return c.json({ error: e instanceof Error ? e.message : "Unknown error saving custom rules" }, 500);
  }
});

// ============================================================================
// Start Server
// ============================================================================

Deno.serve(app.fetch);
