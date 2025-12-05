import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { db } from "./db";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello from the Agentic Dashboard!")
    .listen(3000);

console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;