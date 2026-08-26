import Groq from "groq-sdk";
import { AppError } from "../../../utils/error/error-handler";
import { RecommendationModel } from "./recomendation.model";
import type { RecommendationHistory } from "./recomendation.types";

interface RecommendationInput {
	message: string;
	owner?: string;
	taskContext?: string;
}

export class RecommendationService {
	private recommendation = new RecommendationModel();
	private readonly model = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

	async createRecommendation(input: RecommendationInput, userId?: string) {
		const apiKey = process.env.GROQ_API_KEY;

		if (!apiKey) {
			throw new AppError("GROQ_API_KEY is not configured", 500);
		}

		const groq = new Groq({ apiKey, timeout: 30_000 });
		let completion;

		try {
			completion = await groq.chat.completions.create({
				model: this.model,
				temperature: 0.7,
				messages: [
					{
						role: "system",
						content: "Kamu adalah asisten AI untuk pembagian tugas. Berikan rekomendasi tugas yang jelas, realistis, dan sesuai konteks. Sebutkan nama pemilik tugas bila tersedia. Jawab dalam bahasa Indonesia menggunakan Markdown yang rapi: judul singkat, lalu bagian Prioritas, Tugas, Alasan, dan Langkah berikutnya. Gunakan heading dan bullet list. Jangan gunakan tabel Markdown, garis pemisah, atau karakter pipe."
					},
					{
						role: "user",
						content: [
							`Pesan: ${input.message}`,
							input.owner ? `Pemilik tugas: ${input.owner}` : "",
							input.taskContext ? `Konteks task: ${input.taskContext}` : ""
						].filter(Boolean).join("\n")
					}
				]
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown Groq error";
			console.error("Groq request failed:", message);
			throw new AppError(`Groq request failed: ${message}`, 502);
		}

		const recommendation = completion.choices[0]?.message?.content;

		if (!recommendation) {
			throw new AppError("Groq returned an empty recommendation", 502);
		}

		const history: RecommendationHistory = {
			message: input.message,
			response: recommendation,
			owner: input.owner,
			taskContext: input.taskContext,
			model: this.model,
			createdAt: new Date()
		};
		if (userId) history.userId = userId;
		const historyId = await this.recommendation.createHistory(history);

		return { historyId, recommendation, model: this.model, createdAt: history.createdAt };
	}

	async getHistory(limit = 20, userId?: string) {
		return await this.recommendation.getHistory(limit, userId);
	}

	async getHistoryById(id: string, userId?: string) {
		return await this.recommendation.getHistoryById(id, userId);
	}

	async updateHistory(id: string, history: Partial<RecommendationHistory>, userId?: string) {
		if (!id) {
			throw new AppError("Invalid recommendation history ID", 400);
		}
		return await this.recommendation.update(id, history, userId);
	}

	async deleteHistory(id: string, userId?: string) {
		if (!id) {
			throw new AppError("Invalid recommendation history ID", 400);
		}
		return await this.recommendation.delete(id, userId);
	}
}
