import { AppError } from "../../../utils/error/error-handler";
import { TaskService } from "./task.service";
import type { Task } from "./task.types";

export class TaskController {
    private taskService = new TaskService();

    async createTask({body}: {body: Task}) {
        try {
            const taskId = await this.taskService.createTask(body);
            return { status: 201, body: { message: "Task created successfully", taskId } };
        } catch (error) {
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async getTaskById({params}: {params: {id: string}}) {
        try {
            const task = await this.taskService.getTaskById(params.id); 
            return { status: 200, body: task };
        } catch (error) {
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async getAllTasks({query}: {query: {query?: string}}) {
        try {
            const tasks = await this.taskService.getAllTasks(query.query ?? "");
            return { status: 200, body: tasks };
        } catch (error) {
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async updateTask({params, body}: {params: {id: string}, body: Partial<Task>}) {
        try {
            const updated = await this.taskService.updateTask(params.id, body);
            return { status: 200, body: updated };
        } catch (error) {
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }

    async deleteTask({params}: {params: {id: string}}) {
        try {
            const deleted = await this.taskService.deleteTask(params.id);
            return { status: 200, body: deleted };
        } catch (error) {
            if (error instanceof AppError) {
                return { status: error.statusCode, body: { message: error.message } };
            }
            return { status: 500, body: { message: "Internal Server Error" } };
        }
    }
}