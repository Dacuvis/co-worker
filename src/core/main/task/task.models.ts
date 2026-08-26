import { firestore } from "../../../clients/firebase";
import type { Task } from "./task.types";

export class TaskModel {
    private get tasks() {
        if (!firestore) throw new Error("Firestore is not initialized");
        return firestore.collection("tasks");
    }

    async createTask(task: Task, userId?: string): Promise<string> {
        const doc = await this.tasks.add({
            ...task,
            ...(userId ? { userId } : {}),
            createdAt: new Date(),
        });
        return doc.id;
    }

    async getTaskById(id: string, userId?: string): Promise<Task | null> {
        const doc = await this.tasks.doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data() as Task;
        if (userId && data.userId !== userId) return null;
        return { ...data, id: doc.id };
    }

    async getAllTasks(query: string, userId?: string): Promise<Task[]> {
        console.log("[getAllTasks] userId:", userId);
        let ref: FirebaseFirestore.Query = userId
            ? this.tasks.where("userId", "==", userId).orderBy("createdAt", "desc")
            : this.tasks.orderBy("createdAt", "desc");
        const snapshot = await ref.get();
        console.log("[getAllTasks] total docs:", snapshot.size);
        const tasks = snapshot.docs.map(doc => ({ ...(doc.data() as Task), id: doc.id }));
        if (!query) return tasks;
        const lower = query.toLowerCase();
        return tasks.filter(t =>
            t.title.toLowerCase().includes(lower) ||
            t.description.toLowerCase().includes(lower)
        );
    }

    async update(id: string, task: Partial<Task>, userId?: string): Promise<boolean> {
        const doc = await this.tasks.doc(id).get();
        if (!doc.exists) return false;
        if (userId && (doc.data() as Task).userId !== userId) return false;
        await this.tasks.doc(id).update(task as FirebaseFirestore.UpdateData<Task>);
        return true;
    }

    async delete(id: string, userId?: string): Promise<boolean> {
        const doc = await this.tasks.doc(id).get();
        if (!doc.exists) return false;
        if (userId && (doc.data() as Task).userId !== userId) return false;
        await this.tasks.doc(id).delete();
        return true;
    }
}
