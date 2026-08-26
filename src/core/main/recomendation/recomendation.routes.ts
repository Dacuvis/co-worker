import { Elysia } from "elysia";
import { RecommendationController } from "./recomendation.controller";
import { recommendationHistoryQuerySchema, recommendationSchema, recommendationUpdateSchema } from "./recomendation.validation";
import { verifyFirebaseToken } from "../../../clients/firebase";

async function getUserId(request: Request): Promise<string | undefined> {
    const authorization = request.headers.get("authorization");
    if (authorization?.startsWith("Bearer ")) {
        try {
            const user = await verifyFirebaseToken(authorization.slice(7));
            return user.uid;
        } catch {
            return undefined;
        }
    }
    return undefined;
}

export const recommendationRoutes = new Elysia()
	.post("/recommendations/chat", async (context) => {
		const uid = await getUserId(context.request);
		return await new RecommendationController().createRecommendation({ ...context, user: uid ? { uid } : undefined });
	}, { body: recommendationSchema })
	.get("/recommendations/history", async (context) => {
		const uid = await getUserId(context.request);
		return await new RecommendationController().getHistory({ ...context, user: uid ? { uid } : undefined });
	}, { query: recommendationHistoryQuerySchema })
	.get("/recommendations/history/:id", async (context) => {
		const uid = await getUserId(context.request);
		return await new RecommendationController().getHistoryById({ ...context, user: uid ? { uid } : undefined });
	})
	.patch("/recommendations/history/:id", async (context) => {
		const uid = await getUserId(context.request);
		return await new RecommendationController().updateHistory({ ...context, user: uid ? { uid } : undefined });
	}, { body: recommendationUpdateSchema })
	.delete("/recommendations/history/:id", async (context) => {
		const uid = await getUserId(context.request);
		return await new RecommendationController().deleteHistory({ ...context, user: uid ? { uid } : undefined });
	});
