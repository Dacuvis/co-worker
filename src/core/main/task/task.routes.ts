import { Elysia } from "elysia";
import { TaskController } from "./task.controller";
import {
    taskIdSchema,
    taskQuerySchema,
    taskSchema,
    taskUpdateSchema
} from "./task.validation";
import { verifyFirebaseToken } from "../../../clients/firebase";

async function getUserId(request: Request): Promise<string | undefined> {
    const authorization = request.headers.get("authorization");
    if (authorization?.startsWith("Bearer ")) {
        try {
            const user = await verifyFirebaseToken(authorization.slice(7));
            console.log("[getUserId] uid:", user.uid);
            return user.uid;
        } catch (e) {
            console.log("[getUserId] verifyFirebaseToken error:", e);
            return undefined;
        }
    }
    console.log("[getUserId] no Bearer token found");
    return undefined;
}

export const taskRoutes = new Elysia()
    .post("/tasks", async (context) => {
        const uid = await getUserId(context.request);
        return await new TaskController().createTask({ ...context, user: uid ? { uid } : undefined });
    }, { body: taskSchema })
    .get("/tasks/:id", async (context) => {
        const uid = await getUserId(context.request);
        return await new TaskController().getTaskById({ ...context, user: uid ? { uid } : undefined });
    }, { params: taskIdSchema })
    .get("/tasks", async (context) => {
        const uid = await getUserId(context.request);
        return await new TaskController().getAllTasks({ ...context, user: uid ? { uid } : undefined });
    }, { query: taskQuerySchema })
    .patch("/tasks/:id", async (context) => {
        const uid = await getUserId(context.request);
        return await new TaskController().updateTask({ ...context, user: uid ? { uid } : undefined });
    }, { params: taskIdSchema, body: taskUpdateSchema })
    .delete("/tasks/:id", async (context) => {
        const uid = await getUserId(context.request);
        return await new TaskController().deleteTask({ ...context, user: uid ? { uid } : undefined });
    }, { params: taskIdSchema });