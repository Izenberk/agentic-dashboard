import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";

// Use relative URL in production (same domain), localhost in development
const baseUrl = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";

export const api = treaty<App>(baseUrl);