import { firebaseWebApiKey } from "../../../clients/firebase";
import { AppError } from "../../../utils/error/error-handler";

export class LoginService {
	async login(email: string, password: string) {
		if (!firebaseWebApiKey) throw new AppError("FIREBASE_WEB_API_KEY is not configured", 500);

		const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseWebApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, returnSecureToken: true })
		});

		if (!response.ok) {
			const data = await response.json() as { error?: { message?: string } };
			const code = data.error?.message;
			throw new AppError(code === "INVALID_LOGIN_CREDENTIALS" ? "Invalid email or password" : code ?? "Firebase login failed", response.status === 400 ? 401 : 502);
		}

		const data = await response.json() as { localId: string; email: string; idToken: string; refreshToken: string; expiresIn: string };
		return { user: { uid: data.localId, email: data.email }, idToken: data.idToken, refreshToken: data.refreshToken, expiresIn: Number(data.expiresIn) };
	}
}