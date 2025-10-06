import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import bcrypt from "bcryptjs";

const app = new Hono();

app.get("/", (c) => {
  return c.html("<h1><h2>Abdullah Mubarok</h2></h1>");
});

//Jalankan server
const port = 5000;
console.log(`server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });

// API Registrasi
app.post("/api/register", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({ username, password: hashedpassword })
      .returning({ id: users.id, username: users, username });

    return c.json({ success: true, data: newUser[0] }, 201);
  } catch (error) {
    console.log(error);
    return c.json({ success: false, message: "registrasi gagal" }, 400);
  }
});

// ... (Kode serve)
