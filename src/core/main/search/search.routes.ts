import { Elysia } from "elysia";
import { SearchController } from "./search.controller";
import { searchQuerySchema } from "./search.validation";
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

export const searchRoutes = new Elysia()
	.get("/search", async (context) => {
		const uid = await getUserId(context.request);
		return await new SearchController().search({ ...context, user: uid ? { uid } : undefined });
	}, { query: searchQuerySchema });