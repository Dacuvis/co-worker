import { firestore } from "../../../clients/firebase";
import type { RecommendationHistory } from "../recomendation/recomendation.types";
import type { Task } from "../task/task.types";

export class SearchModel {
    private get tasks() {
        if (!firestore) throw new Error("Firestore is not initialized");
        return firestore.collection("tasks");
    }

    private get recommendations() {
        if (!firestore) throw new Error("Firestore is not initialized");
        return firestore.collection("recommendation_history");
    }

    async search(query: string, limit: number, userId?: string): Promise<{ tasks: Task[]; recommendations: RecommendationHistory[] }> {
        const lower = query.toLowerCase();

        // Ambil semua dokumen milik user, lalu filter di sisi aplikasi
        // (Firestore tidak mendukung full-text search secara native)
        const [taskSnap, recSnap] = await Promise.all([
            userId
                ? this.tasks.where("userId", "==", userId).get()
                : this.tasks.get(),
            userId
                ? this.recommendations.where("userId", "==", userId).orderBy("createdAt", "desc").get()
                : this.recommendations.orderBy("createdAt", "desc").get(),
        ]);

        const tasks = taskSnap.docs
            .map(doc => ({ ...(doc.data() as Task), id: doc.id }))
            .filter(t =>
                t.title.toLowerCase().includes(lower) ||
                t.description.toLowerCase().includes(lower)
            )
            .slice(0, limit);

        const recommendations = recSnap.docs
            .map(doc => ({ ...(doc.data() as RecommendationHistory), id: doc.id }))
            .filter(r =>
                r.message.toLowerCase().includes(lower) ||
                r.response.toLowerCase().includes(lower) ||
                (r.owner ?? "").toLowerCase().includes(lower) ||
                (r.taskContext ?? "").toLowerCase().includes(lower)
            )
            .slice(0, limit);

        return { tasks, recommendations };
    }
}
