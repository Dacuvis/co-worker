import { Elysia } from "elysia";
import { RegisterController } from "./register.controller";
import { registerSchema } from "./register.validation";

export const registerRoutes = new Elysia().post("/register", async (context) => {
	return await new RegisterController().register(context);
}, { body: registerSchema });