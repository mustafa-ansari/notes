"use server"

import { getUser } from "@/auth/server";
import prisma from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";

export const deleteNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("Must be logged in to delete a note");

        await prisma.note.delete({
            where: {id: noteId, authorId: user.id},
        });

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const updateNoteAction = async (noteId: string, text: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("Must be logged in to update a note");

        await prisma.note.update({
            where: { id: noteId },
            data: { text },
        });

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const createNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("Must be logged in to create a note");

        await prisma.note.create({
            data: {
                id: noteId,
                authorId: user.id,
                text: "",
            },
        });

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const askAIAction = async (updatedQuestions: string[], responses: string[]) => {
    
    const user = await getUser();
    const ai = new GoogleGenAI({});

    if (!user) throw new Error("Must be logged in to ask AI questions");

    const notes = await prisma.note.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        select: { text:true, createdAt: true, updatedAt:true },
    });

    if (notes.length === 0) {
        return "You don't have any notes yet";
    }

    const formattedNotes = notes.map(
        note => 
        `
        Text: ${note.text}
        Created at: ${note.createdAt}
        Last Updated: ${note.updatedAt}
        `.trim(),
    ).join("\n");

    const content: string[] = [

    ];

    for (let i = 0; i< updatedQuestions.length; i++) {
        content.push(`user: ${updatedQuestions[i]}`);
        if (responses.length > 1) {
            content.push(`model: ${responses[i]}`);
        }
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: content,
        config: {
            systemInstruction: 
            `You are a helpful assistant that answers questions about a user's notes. 
            Assume all questions are related to the user's notes. 
            Make sure that your answers are not too verbose and you speak succinctly. 
            Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> to wrap the response as appropriate. 
            Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
            Avoid inline styles, JavaScript, or custom attributes.
            
            Rendered like this in JSX:
            <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

            Here are the user's notes:
            ${formattedNotes}`
        }
    });

    return response.text || "An error occurred";

}