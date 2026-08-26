import { firestore } from "../../../clients/firebase";
import type { RecommendationHistory } from "./recomendation.types";

export class RecommendationModel {
    private get recommendations() {
        if (!firestore) throw new Error("Firestore is not initialized");
        return firestore.collection("recommendation_history");
    }

    async createHistory(history: RecommendationHistory): Promise<string> {
        const doc = await this.recommendations.add({ ...history });
        return doc.id;
    }

    async getHistory(limit: number, userId?: string): Promise<RecommendationHistory[]> {
        let ref = this.recommendations.orderBy("createdAt", "desc").limit(limit) as FirebaseFirestore.Query;
        if (userId) ref = this.recommendations.where("userId", "==", userId).orderBy("createdAt", "desc").limit(limit);
        const snapshot = await ref.get();
        return snapshot.docs.map(doc => ({ ...(doc.data() as RecommendationHistory), id: doc.id }));
    }

    async getHistoryById(id: string, userId?: string): Promise<RecommendationHistory | null> {
        const doc = await this.recommendations.doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data() as RecommendationHistory;
        if (userId && data.userId !== userId) return null;
        return { ...data, id: doc.id };
    }

    async update(id: string, history: Partial<RecommendationHistory>, userId?: string): Promise<boolean> {
        const doc = await this.recommendations.doc(id).get();
        if (!doc.exists) return false;
        if (userId && (doc.data() as RecommendationHistory).userId !== userId) return false;
        await this.recommendations.doc(id).update(history as FirebaseFirestore.UpdateData<RecommendationHistory>);
        return true;
    }

    async delete(id: string, userId?: string): Promise<boolean> {
        const doc = await this.recommendations.doc(id).get();
        if (!doc.exists) return false;
        if (userId && (doc.data() as RecommendationHistory).userId !== userId) return false;
        await this.recommendations.doc(id).delete();
        return true;
    }
}
