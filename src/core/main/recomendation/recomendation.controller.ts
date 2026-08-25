import { ObjectId } from "mongodb";
import { AppError } from "../../../utils/error/error-handler";
import { RecommendationService } from "./recomendation.service";
import type { RecommendationHistory } from "./recomendation.types";

export class RecommendationController {
	private recommendationService = new RecommendationService();

	async createRecommendation({body}: {body: {message: string, owner?: string, taskContext?: string}}) {
		try {
			const result = await this.recommendationService.createRecommendation(body);
			return { status: 201, body: result };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async getHistory({query}: {query: {limit?: number}}) {
		try {
			const history = await this.recommendationService.getHistory(query.limit ?? 20);
			return { status: 200, body: history };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async getHistoryById({params}: {params: {id: string}}) {
		try {
			if (!ObjectId.isValid(params.id)) {
				throw new AppError("Invalid recommendation history ID", 400);
			}
			const history = await this.recommendationService.getHistoryById(params.id);
			return { status: 200, body: history };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async updateHistory({params, body}: {params: {id: string}, body: Partial<RecommendationHistory>}) {
		try {
			const updated = await this.recommendationService.updateHistory(params.id, body);
			return { status: 200, body: updated };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}

	async deleteHistory({params}: {params: {id: string}}) {
		try {
			const deleted = await this.recommendationService.deleteHistory(params.id);
			return { status: 200, body: deleted };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}
}
