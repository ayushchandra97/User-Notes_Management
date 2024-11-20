import {Request, Response} from "express";
import {getAuth} from "firebase-admin/auth";
import {onRequest} from "firebase-functions/https";
import {loginSchema} from "./schemas";

const auth = getAuth();

/**
 * Middleware to check auth
 */
export async function authenticateUser(
  req: Request,
  res: Response
): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({message: "Unauthorized: No token provided"});
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    console.log("Verifying token:", idToken);

    const decodedToken = await auth.verifyIdToken(idToken);

    console.log("Decoded token:", decodedToken);

    return decodedToken.uid;
  } catch (error) {
    res.status(401).send({message: "Unauthorized: Invalid or expired token"});
    console.error(error);
    return null;
  }
}

// Login user from server side and get custom token
export const loginUser = onRequest(async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;

    const validatedFields = loginSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      res.status(400).json(validatedFields.error.flatten().fieldErrors);
    }

    const userRecord = await auth.getUserByEmail(email);
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(200).send({
      message: "Login successful",
      customToken,
    });
  } catch (error) {
    res.status(401).send({
      message: "Login failed. Check your credentials",
      error: error.message,
    });
  }
});
