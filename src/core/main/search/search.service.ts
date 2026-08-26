import { SearchModel } from "./search.model";
import { AppError } from "../../../utils/error/error-handler";

export class SearchService {
	private searchModel = new SearchModel();

	async search(query: string, limit = 20, userId?: string) {
		const normalizedQuery = query.trim();

		if (!normalizedQuery) {
			throw new AppError("Search query cannot be empty", 400);
		}

		return await this.searchModel.search(normalizedQuery, limit, userId);
	}
}