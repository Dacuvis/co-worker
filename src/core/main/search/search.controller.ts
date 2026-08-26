import { AppError } from "../../../utils/error/error-handler";
import { SearchService } from "./search.service";

export class SearchController {
	private searchService = new SearchService();

	async search({ query, user }: { query: { query: string; limit?: number }; user?: { uid: string } }) {
		try {
			const results = await this.searchService.search(query.query, query.limit ?? 20, user?.uid);
			return { status: 200, body: results };
		} catch (error) {
			if (error instanceof AppError) {
				return { status: error.statusCode, body: { message: error.message } };
			}
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}
}