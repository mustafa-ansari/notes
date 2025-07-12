import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "";

    const latestNoteId = await prisma.note.findFirst({
       where: {
        authorId: userId,
       },
       orderBy: {
        createdAt: "desc",
       },
       select: {
        id: true,
       },
    });

    return NextResponse.json({
        latestNoteId: latestNoteId?.id,
    });
}