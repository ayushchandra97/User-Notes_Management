import {onRequest} from "firebase-functions/v2/https";
import {authenticateUser} from "./auth";
import {notesSchema} from "./schemas";
import {logger} from "firebase-functions/v2";
import {getNotesFromFirestore, saveNotesInFirestore} from "./firestore";

export const saveNotes = onRequest(async (req, res) => {
  try {
    const uid = await authenticateUser(req, res);

    let {title, content, pinned, reminder} = req.body;

    if (!uid) {
      res.status(401).json({message: "Unauthorized access."});
      return;
    }

    const validatedFields = notesSchema.safeParse({
      title,
      content,
      pinned,
      reminder,
    });

    if (!validatedFields.success) {
      res.status(400).json(validatedFields.error.flatten().fieldErrors);
    }

    if (!reminder) {
      reminder = null;
    }

    if (!pinned) {
      pinned = false;
    }

    const note = {
      title,
      content,
      reminder,
      pinned,
      userId: uid,
      createdAt: new Date().toISOString(),
    };

    await saveNotesInFirestore(note);

    res.status(201).send({message: "Note saved successfully", note});
  } catch (error) {
    logger.error("Error saving note:", error);
    res.status(500).send({error: error.message});
  }
});

// Get All User's Notes
export const getNotes = onRequest(async (req, res) => {
  try {
    const uid = await authenticateUser(req, res);
    if (!uid) {
      res.status(401).json({message: "Unauthorized access."});
      return;
    }

    const notesSnapshot = await getNotesFromFirestore(uid);

    if (notesSnapshot.empty) {
      res.status(404).send({message: "No notes found for the user"});
      return;
    }

    const notes = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send({notes});
  } catch (error) {
    logger.error("Error retrieving notes:", error);
    res.status(500).send({error: error.message});
  }
});
