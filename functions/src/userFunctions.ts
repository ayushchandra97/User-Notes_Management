import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {authenticateUser} from "./auth";
import {userSchema, updateUserSchema} from "./schemas";
import {
  createUserInFirestore,
  updateUserInFirestore,
  deleteUserFromFirestore,
  deleteNotesFromFirestore,
} from "./firestore";
import {getAuth} from "firebase-admin/auth";

const auth = getAuth();

// Create User
export const newUser = onRequest(async (req, res) => {
  try {
    const {name, email, password, gender, age} = req.body;

    const validatedFields = userSchema.safeParse({
      name,
      email,
      password,
      gender,
      age,
    });

    if (!validatedFields.success) {
      res.status(400).json(validatedFields.error.flatten().fieldErrors);
      return;
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await createUserInFirestore(userRecord.uid, {
      name: userRecord.displayName,
      email: userRecord.email,
      gender,
      age,
      createdAt: new Date().toISOString(),
    });

    res
      .status(201)
      .send({uid: userRecord.uid, message: "User registered successfully"});
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).send({error: error.message});
  }
});

// Update User
export const updateUser = onRequest(async (req, res) => {
  try {
    const uid = await authenticateUser(req, res);

    const {name, email, gender, age} = req.body;

    if (!uid) {
      res.status(401).json({message: "Unauthorized access."});
      return;
    }

    if (!name && !email && !gender && !age) {
      res.status(400).json({
        message: "Nothing to update. Provide name, email, gender, or age.",
      });
      return;
    }

    const validatedFields = updateUserSchema.safeParse({
      name,
      email,
      gender,
      age,
    });

    if (!validatedFields.success) {
      res.status(400).json(validatedFields.error.flatten().fieldErrors);
      return;
    }

    const updates: Record<string, string> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (gender) updates.gender;
    if (age) updates.age;

    await updateUserInFirestore(uid, updates);

    res.status(200).send({message: "User updated successfully", updates});
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).send({error: error.message});
  }
});

// Delete User
export const deleteUser = onRequest(async (req, res) => {
  try {
    const uid = await authenticateUser(req, res);
    if (!uid) {
      res.status(401).json({message: "Unauthorized access."});
      return;
    }

    await auth.deleteUser(uid);

    await deleteUserFromFirestore(uid);

    await deleteNotesFromFirestore(uid);

    res.status(200).send({message: "User deleted successfully"});
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).send({error: error.message});
  }
});
