"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { errorMessage: "User not found" };
    }
    await prisma.notes.update({
      where: { id: noteId },
      data: { text },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");
    await prisma.notes.create({
      data: { id: noteId, authorId: user.id, text: "" },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { errorMessage: "User not found" };
    }
    await prisma.notes.delete({
      where: { id: noteId, authorId: user.id },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};