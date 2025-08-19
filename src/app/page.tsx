import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteText from "@/components/NoteText";
import prisma from "@/db/prisma";

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
	const noteIDParam = (await searchParams).noteId;
	const user = await getUser();
	const noteId = Array.isArray(noteIDParam)
		? noteIDParam![0]
		: noteIDParam || "";
	const note = await prisma.note.findUnique({
		where: {
			id: noteId,
			authorId: user?.id,
		},
	});

	return (
		<div className="flex h-full flex-col items-center gap-4">
			<div className="flex w-full max-w-4xl justify-end gap-2">
				<AskAIButton user={user} />
				<NewNoteButton user={user} />
			</div>

			{/* <NoteTitle noteId={noteId} startingNoteTitle={note?.title || ""} /> */}
			<NoteText
				noteId={noteId}
				startingNoteText={note?.text || ""}
				startingNoteTitle={note?.title || ""}
			/>
		</div>
	);
}

export default HomePage;
