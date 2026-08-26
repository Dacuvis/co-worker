import { AppError } from "../../../utils/error/error-handler";
import { TaskService } from "./task.service";
import type { Task } from "./task.types";

export class TaskController {
    private taskService = new TaskService();

    async createTask({body, user}: {body: Task, user?: {uid: string}}) {
        console.log("[createTask] uid:", user?.uid, "body:", body);
        try {
            const taskId = await this.taskService.createTask(body, user?.uid);
            console.log("[createTask] success, taskId:", taskId);
            return { status: 201, body: { message: "Task created successfully", taskId } };
        } catch (error) {
            console.error("[createTask] ERROR:", error);
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async getTaskById({params, user}: {params: {id: string}, user?: {uid: string}}) {
        try {
            const task = await this.taskService.getTaskById(params.id, user?.uid); 
            return { status: 200, body: task };
        } catch (error) {
            console.error("[getTaskById] ERROR:", error);
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async getAllTasks({query, user}: {query: {query?: string}, user?: {uid: string}}) {
        console.log("[getAllTasks] uid:", user?.uid);
        try {
            const tasks = await this.taskService.getAllTasks(query.query ?? "", user?.uid);
            console.log("[getAllTasks] returning", tasks.length, "tasks");
            return { status: 200, body: tasks };
        } catch (error) {
            console.error("[getAllTasks] ERROR:", error);
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async updateTask({params, body, user}: {params: {id: string}, body: Partial<Task>, user?: {uid: string}}) {
        try {
            const updated = await this.taskService.updateTask(params.id, body, user?.uid);
            return { status: 200, body: updated };
        } catch (error) {
            console.error("[updateTask] ERROR:", error);
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async deleteTask({params, user}: {params: {id: string}, user?: {uid: string}}) {
        try {
            const deleted = await this.taskService.deleteTask(params.id, user?.uid);
            return { status: 200, body: deleted };
        } catch (error) {
            console.error("[deleteTask] ERROR:", error);
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }
}
