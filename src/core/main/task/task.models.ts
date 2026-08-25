import { ObjectId } from "mongodb";
import { db } from "../../../clients/clients";
import type  { Task } from "./task.types";

export class TaskModel {
    private tasks = db.collection("tasks");

    async createTask(task: Task) {
        const result = await this.tasks.insertOne(task);
        return result.insertedId;
    }

    async getTaskById(id: string) {
        const task = await this.tasks.findOne({
            _id: new ObjectId(id)
        })

        return task
    }

    async getAllTasks(query: string) {
        const filter = query
        ? { query }
        : {}
        const tasks = await this.tasks.find(filter).toArray();
        return tasks;
    }

    async update(id: string, task: Partial<Task>) {
        const result = await this.tasks.updateOne(
            { _id: new ObjectId(id) },
            { $set: task }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string) {
        const result = await this.tasks.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}