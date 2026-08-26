import { Elysia } from "elysia";
import { taskRoutes } from "./src/core/main/task/task.routes";
import { recommendationRoutes } from "./src/core/main/recomendation/recomendation.routes";
import { searchRoutes } from "./src/core/main/search/search.routes";
import { loginRoutes } from "./src/core/main/login/login.routes";
import { registerRoutes } from "./src/core/main/register/register.routes";
import { userRoutes } from "./src/core/main/user/user.routes";
import { apiKeyMiddleware } from "./src/utils/middleware/api-key";

const app = new Elysia()
    .onRequest(({ request, set }) => {
        set.headers["Access-Control-Allow-Origin"] = "http://localhost:3001";
        set.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type, x-api-key, Authorization";

        if (request.method === "OPTIONS") {
            set.status = 204;
            return "";
        }
    })
    .use(loginRoutes)
    .use(registerRoutes)
    .use(userRoutes)
    .use(apiKeyMiddleware)
    .use(taskRoutes)
    .use(recommendationRoutes)
    .use(searchRoutes);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});