import { AppError } from "../../../utils/error/error-handler";
import { RegisterService } from "./register.service";

export class RegisterController {
	private registerService = new RegisterService();

	async register({ body }: { body: { email: string; password: string; displayName?: string } }) {
		try {
			return { status: 201, body: await this.registerService.register(body) };
		} catch (error) {
			if (error instanceof AppError) return { status: error.statusCode, body: { message: error.message } };
			return { status: 500, body: { message: "Internal Server Error" } };
		}
	}
}