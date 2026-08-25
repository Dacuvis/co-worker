import { Elysia } from "elysia";
import { TaskController } from "./task.controller";
import {
    taskIdSchema,
    taskQuerySchema,
    taskSchema,
    taskUpdateSchema
} from "./task.validation";

export const taskRoutes = new Elysia()
    .post("/tasks", async (context) => {
        return await new TaskController().createTask(context);
    }, { body: taskSchema })
    .get("/tasks/:id", async (context) => {
        return await new TaskController().getTaskById(context);
    }, { params: taskIdSchema })
    .get("/tasks", async (context) => {
        return await new TaskController().getAllTasks(context);
    }, { query: taskQuerySchema })
    .patch("/tasks/:id", async (context) => {
        return await new TaskController().updateTask(context);
    }, { params: taskIdSchema, body: taskUpdateSchema })
    .delete("/tasks/:id", async (context) => {
        return await new TaskController().deleteTask(context);
    }, { params: taskIdSchema });