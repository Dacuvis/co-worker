import { Elysia } from "elysia"
import { verifyFirebaseToken } from "../../clients/firebase";
import { AppError } from "../error/error-handler";

export const apiKeyMiddleware = new Elysia({ name: "apiKeyMiddleware" })
    .onError({ as: "scoped" }, ({ error, set }) => {
        if (error instanceof AppError) {
            set.status = error.statusCode;
            return { status: error.statusCode, body: { message: error.message } };
        }
    })
    .derive({ as: "scoped" }, async ({request}) => {
        const apiKey = request.headers.get("x-api-key");
        const authorization = request.headers.get("authorization");

        if (authorization?.startsWith("Bearer ")) {
            try {
                const user = await verifyFirebaseToken(authorization.slice(7));
                return { apiKey: undefined, user };
            } catch (e) {
                console.error("[apiKeyMiddleware] verifyFirebaseToken error:", e);
                throw new AppError("Unauthorized: Invalid or expired Firebase token", 401);
            }
        }

        if (apiKey && apiKey === process.env.API_KEY) {
            return { apiKey, user: undefined };
        }

        throw new AppError(apiKey ? "Unauthorized: Invalid API Key" : "Unauthorized: API Key or Firebase token is required", 401);
    })