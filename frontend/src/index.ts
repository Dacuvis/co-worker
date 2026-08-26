import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 3001,
  routes: {
    "/config": {
      GET() {
        return Response.json({
          apiUrl: process.env.BUN_PUBLIC_API_URL || "http://localhost:3000",
          firebase: {
            BUN_PUBLIC_FIREBASE_API_KEY: process.env.BUN_PUBLIC_FIREBASE_API_KEY,
            BUN_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.BUN_PUBLIC_FIREBASE_AUTH_DOMAIN,
            BUN_PUBLIC_FIREBASE_PROJECT_ID: process.env.BUN_PUBLIC_FIREBASE_PROJECT_ID,
            BUN_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.BUN_PUBLIC_FIREBASE_STORAGE_BUCKET,
            BUN_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.BUN_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            BUN_PUBLIC_FIREBASE_APP_ID: process.env.BUN_PUBLIC_FIREBASE_APP_ID,
          },
        });
      },
    },
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
