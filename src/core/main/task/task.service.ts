import { ObjectId } from "mongodb";
import { TaskModel } from "./task.models";
import type { Task } from "./task.types";
import { AppError } from "../../../utils/error/error-handler";

export class TaskService {
    private task = new TaskModel();

    async createTask(task: Task) {
        return await this.task.createTask(task);
    }

    async getTaskById(id: string) {
        if (!ObjectId.isValid(id)) {
            throw new AppError("Invalid task ID", 400);
        }
        return await this.task.getTaskById(id);
    }

    async getAllTasks(query: string) {
        return await this.task.getAllTasks(query);
    }

    async updateTask(id: string, task: Partial<Task>) {
        if (!ObjectId.isValid(id)) {
            throw new AppError("Invalid task ID", 400);
        }
        return await this.task.update(id, task);
    }

    async deleteTask(id: string) {
        if (!ObjectId.isValid(id)) {
            throw new AppError("Invalid task ID", 400);
        }
        return await this.task.delete(id);
    }
}