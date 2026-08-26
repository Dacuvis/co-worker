import { AppError } from "../../../utils/error/error-handler";
import { LoginService } from "./login.service";

export class LoginController {
	private loginService = new LoginService();

	async login({ body }: { body: { email: string; password: string } }) {
		try {
			return { status: 200, body: await this.loginService.login(body.email, body.password) };
		} catch (error) {
			if (error instanceof AppError) return { status: error.statusCode, body: { message: error.message } };
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}
}