import { verifyFirebaseToken } from "../../../clients/firebase";
import { AppError } from "../../../utils/error/error-handler";

export class UserController {
	async getCurrentUser({ request }: { request: Request }) {
		try {
			const authorization = request.headers.get("authorization");
			const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
			if (!token) throw new AppError("Authorization Bearer token is required", 401);

			const decodedToken = await verifyFirebaseToken(token);
			return { status: 200, body: { uid: decodedToken.uid, email: decodedToken.email, emailVerified: decodedToken.email_verified, displayName: decodedToken.name ?? null } };
		} catch (error) {
			if (error instanceof AppError) return { status: error.statusCode, body: { message: error.message } };
			return { status: 401, body: { message: "Invalid or expired Firebase token" } };
		}
	}
}