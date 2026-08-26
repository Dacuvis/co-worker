import { Elysia } from "elysia";
import { UserController } from "./user.controller";

export const userRoutes = new Elysia().get("/users/me", async (context) => {
	return await new UserController().getCurrentUser(context);
});