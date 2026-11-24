import "dotenv/config";

function required(field: string): string {
	const value = process.env[field];
	if (!value) {
		throw new Error(`${field} not configured`);
	}
	return value;
}

function isInteger(value: string): number {
	const intValue = Number(value);
	if (!Number.isInteger(intValue)) {
		throw new Error(`${value} must be a number`);
	}
	return intValue;
}

export const CONFIG = {
	host: required("HOST"),
	port: isInteger(required("PORT")),
	corsOrigin: required("CORS_ORIGIN"),
	isProduction: process.env.NODE_ENV === "production",
	databaseUrl: required("DATABASE_URL"),
	passwordPepper: required("PEPPER"),
	jwtAccessSecret: required("JWT_ACCESS_KEY"),
	jwtRefreshSecret: required("JWT_REFRESH_KEY"),
	tokenAccessTime: isInteger(required("TOKEN_ACCESS_TIME")),
	tokenRefreshTime: isInteger(required("TOKEN_REFRESH_TIME")),
};
