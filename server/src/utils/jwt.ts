import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ms from "ms";

dotenv.config();
//comeback to creating a type for the user, just using any for convinience for now
export const getJwtExpiryMs = (environmentVariable: string) => {
  const expiry = process.env[environmentVariable];
  const duration = expiry ? ms(expiry as ms.StringValue) : undefined;

  if (typeof duration !== "number" || !Number.isFinite(duration) || duration <= 0) {
    throw new Error(`${environmentVariable} must be a valid positive duration`);
  }

  return duration;
};

export const generateToken = (user: any) => {
    let jwt_secret = process.env.JWT_SECRET;
    let jwt_expires_in = process.env.JWT_EXPIRES_IN;
    if (!jwt_secret) {
        throw new Error("jwt secret is undefined")
    }
    
    if (!jwt_expires_in) {
        throw new Error("jwt limit is undefined")
    }
    getJwtExpiryMs("JWT_EXPIRES_IN");
    const payload = {
        id: user.id,
        email: user.email
    }
    
    return jwt.sign(payload, jwt_secret, {expiresIn: jwt_expires_in as any});
}

export const generateRefreshToken = (user: any, jti: string) => {
  const refreshExpiresIn = process.env.REFRESH_JWT_EXPIRES_IN;
  if (!refreshExpiresIn) {
    throw new Error("refresh jwt expiry is undefined");
  }
  getJwtExpiryMs("REFRESH_JWT_EXPIRES_IN");
  return jwt.sign(
    { id: user.id, jti },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: refreshExpiresIn as any }
  );
};