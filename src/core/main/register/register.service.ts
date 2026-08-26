import { firebaseAuth, firebaseWebApiKey } from "../../../clients/firebase";
import { AppError } from "../../../utils/error/error-handler";

interface RegisterInput {
	email: string;
	password: string;
	displayName?: string;
}

export class RegisterService {
	async register(input: RegisterInput) {
		if (!firebaseWebApiKey) {
			throw new AppError("FIREBASE_WEB_API_KEY is not configured", 500);
		}

		const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseWebApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: input.email,
				password: input.password,
				returnSecureToken: true
			})
		});

		if (!response.ok) {
			throw new AppError(await getFirebaseError(response), response.status === 400 ? 400 : 502);
		}

		const data = await response.json() as { localId: string; email: string; idToken: string; refreshToken: string; expiresIn: string };
		if (input.displayName && firebaseAuth) {
			await firebaseAuth.updateUser(data.localId, { displayName: input.displayName });
		}

		return {
			user: { uid: data.localId, email: data.email, displayName: input.displayName },
			idToken: data.idToken,
			refreshToken: data.refreshToken,
			expiresIn: Number(data.expiresIn)
		};
	}
}

async function getFirebaseError(response: Response) {
	const data = await response.json() as { error?: { message?: string } };
	const code = data.error?.message;
	return code === "EMAIL_EXISTS" ? "Email is already registered" : code ?? "Firebase registration failed";
}