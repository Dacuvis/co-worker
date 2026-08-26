import { t } from "elysia";

export const searchQuerySchema = t.Object({
	query: t.String({ minLength: 1 }),
	limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 }))
});