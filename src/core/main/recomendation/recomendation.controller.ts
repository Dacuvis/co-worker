import { AppError } from "../../../utils/error/error-handler";
import { RecommendationService } from "./recomendation.service";
import type { RecommendationHistory } from "./recomendation.types";

export class RecommendationController {
	private recommendationService = new RecommendationService();

	async createRecommendation({body, user}: {body: {message: string, owner?: string, taskContext?: string}, user?: {uid: string}}) {
		try {
			const result = await this.recommendationService.createRecommendation(body, user?.uid);
			return { status: 201, body: result };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async getHistory({query, user}: {query: {limit?: number}, user?: {uid: string}}) {
		try {
			const history = await this.recommendationService.getHistory(query.limit ?? 20, user?.uid);
			return { status: 200, body: history };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async getHistoryById({params, user}: {params: {id: string}, user?: {uid: string}}) {
		try {
			if (!params.id) {
				throw new AppError("Invalid recommendation history ID", 400);
			}
			const history = await this.recommendationService.getHistoryById(params.id, user?.uid);
			return { status: 200, body: history };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async updateHistory({params, body, user}: {params: {id: string}, body: Partial<RecommendationHistory>, user?: {uid: string}}) {
		try {
			const updated = await this.recommendationService.updateHistory(params.id, body, user?.uid);
			return { status: 200, body: updated };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async deleteHistory({params, user}: {params: {id: string}, user?: {uid: string}}) {
		try {
			const deleted = await this.recommendationService.deleteHistory(params.id, user?.uid);
			return { status: 200, body: deleted };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}
}
