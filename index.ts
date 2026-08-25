import { Elysia } from "elysia";
import { taskRoutes } from "./src/core/main/task/task.routes";
import { apiKeyMiddleware } from "./src/utils/middleware/api-key";

const app = new Elysia()
    .use(apiKeyMiddleware)
    .use(taskRoutes);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});