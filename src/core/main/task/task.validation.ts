import { t } from "elysia";

export const taskSchema = t.Object({
    title: t.String(),
    description: t.String(),
    completed: t.Boolean()
});

export const taskUpdateSchema = t.Object({
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    completed: t.Optional(t.Boolean()),
    archived: t.Optional(t.Boolean())
});

export const taskIdSchema = t.Object({
    id: t.String()
});

export const taskQuerySchema = t.Object({
    query: t.Optional(t.String())
});