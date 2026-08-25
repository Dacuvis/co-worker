import { Elysia } from "elysia";
import { taskRoutes } from "./src/core/main/task/task.routes";
import { recommendationRoutes } from "./src/core/main/recomendation/recomendation.routes";
import { apiKeyMiddleware } from "./src/utils/middleware/api-key";

const app = new Elysia()
    .onRequest(({ request, set }) => {
        set.headers["Access-Control-Allow-Origin"] = "http://localhost:3001";
        set.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type, x-api-key";

        if (request.method === "OPTIONS") {
            set.status = 204;
            return "";
        }
    })
    .use(apiKeyMiddleware)
    .use(taskRoutes)
    .use(recommendationRoutes);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});