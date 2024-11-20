import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();

export type Note = {
  title: string
  content?: string
  reminder?: string
  pinned?: boolean
  userId: string
  createdAt: string
}
export type UpdateNote = {
  title?: string
  content?: string
  reminder?: string
  pinned?: boolean
  userId?: string
  createdAt?: string
}

export type UserData = {
  name?: string
  email?: string
  gender: ["Male", "Female"]
  age: number
  createdAt: string
}

export const createUserInFirestore = async (
  userId: string,
  userData: UserData
) => {
  await db.collection("users").doc(userId).set(userData);
};

export const updateUserInFirestore = async (
  userId: string,
  updates: UpdateNote
) => {
  await db.collection("users").doc(userId).update(updates);
};

export const deleteUserFromFirestore = async (userId: string) => {
  await db.collection("users").doc(userId).delete();
};

export const saveNotesInFirestore = async (note: Note) => {
  await db.collection("notes").add(note);
};

export const getNotesFromFirestore = async (userId: string) => {
  const notesSnapshot = await db
    .collection("notes")
    .where("userId", "==", userId)
    .get();
  return notesSnapshot;
};

export const deleteNotesFromFirestore = async (userId: string) => {
  try {
    const notesSnapshot = await db
      .collection("notes")
      .where("userId", "==", userId)
      .get();

    if (notesSnapshot.empty) {
      console.log("No notes found for the user.");
      return;
    }

    const deletePromises = notesSnapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    console.log(`All notes for user ${userId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting notes:", error);
    throw new Error("Failed to delete notes.");
  }
};
