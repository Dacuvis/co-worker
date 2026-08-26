import { TaskModel } from "./task.models";
import type { Task } from "./task.types";
import { AppError } from "../../../utils/error/error-handler";

export class TaskService {
    private task = new TaskModel();

    async createTask(task: Task, userId?: string) {
        return await this.task.createTask(task, userId);
    }

    async getTaskById(id: string, userId?: string) {
        if (!id) throw new AppError("Invalid task ID", 400);
        return await this.task.getTaskById(id, userId);
    }

    async getAllTasks(query: string, userId?: string) {
        return await this.task.getAllTasks(query, userId);
    }

    async updateTask(id: string, task: Partial<Task>, userId?: string) {
        if (!id) throw new AppError("Invalid task ID", 400);
        return await this.task.update(id, task, userId);
    }

    async deleteTask(id: string, userId?: string) {
        if (!id) throw new AppError("Invalid task ID", 400);
        return await this.task.delete(id, userId);
    }
}
