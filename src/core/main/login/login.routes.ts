import { Elysia } from "elysia";
import { LoginController } from "./login.controller";
import { loginSchema } from "./login.validation";

export const loginRoutes = new Elysia().post("/login", async (context) => {
	return await new LoginController().login(context);
}, { body: loginSchema });