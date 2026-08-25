import { t } from "elysia";

export const recommendationSchema = t.Object({
	message: t.String({ minLength: 1 }),
	owner: t.Optional(t.String()),
	taskContext: t.Optional(t.String())
});

export const recommendationHistoryQuerySchema = t.Object({
	limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 }))
});

export const recommendationUpdateSchema = t.Object({
	response: t.Optional(t.String({ minLength: 1 })),
	owner: t.Optional(t.String()),
	taskContext: t.Optional(t.String()),
	archived: t.Optional(t.Boolean())
});
