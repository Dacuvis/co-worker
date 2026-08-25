import { Elysia } from "elysia"
import { AppError } from "../error/error-handler";

export const apiKeyMiddleware = new Elysia()
    .derive(({request, set}) => {
        const apiKey = request.headers.get("x-api-key");

        if (!apiKey) {
            throw new AppError("Unauthorized: API Key is missing", 401);
        }

        if (apiKey !== process.env.API_KEY) {
            throw new AppError("Unauthorized: Invalid API Key", 401);
        }

        return { apiKey }
    })