import { ObjectId } from "mongodb";
import { db } from "../../../clients/clients";
import type { RecommendationHistory } from "./recomendation.types";

export class RecommendationModel {
	private recommendations = db.collection<RecommendationHistory>("recommendation_history");

	async createHistory(history: RecommendationHistory) {
		const result = await this.recommendations.insertOne(history);
		return result.insertedId;
	}

	async getHistory(limit: number) {
		return await this.recommendations
			.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.toArray();
	}

	async getHistoryById(id: string) {
		return await this.recommendations.findOne({ _id: new ObjectId(id) });
	}

	async update(id: string, history: Partial<RecommendationHistory>) {
		const result = await this.recommendations.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: history }
		);
		return result.modifiedCount > 0;
	}

	async delete(id: string) {
		const result = await this.recommendations.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}
}
