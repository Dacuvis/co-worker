import { Elysia } from "elysia";
import { RecommendationController } from "./recomendation.controller";
import { recommendationHistoryQuerySchema, recommendationSchema, recommendationUpdateSchema } from "./recomendation.validation";

export const recommendationRoutes = new Elysia()
	.post("/recommendations/chat", async (context) => {
		return await new RecommendationController().createRecommendation(context);
	}, { body: recommendationSchema })
	.get("/recommendations/history", async (context) => {
		return await new RecommendationController().getHistory(context);
	}, { query: recommendationHistoryQuerySchema })
	.get("/recommendations/history/:id", async (context) => {
		return await new RecommendationController().getHistoryById(context);
	})
	.patch("/recommendations/history/:id", async (context) => {
		return await new RecommendationController().updateHistory(context);
	}, { body: recommendationUpdateSchema })
	.delete("/recommendations/history/:id", async (context) => {
		return await new RecommendationController().deleteHistory(context);
	});
