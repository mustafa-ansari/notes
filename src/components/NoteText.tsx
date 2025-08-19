"use client";

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useEffect } from "react";
import { debounceTimeout } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";
import { Input } from "./ui/input";

type Props = {
	noteId: string;
	startingNoteText: string;
	startingNoteTitle: string;
};

let titleUpdateTimeout: NodeJS.Timeout;
let textUpdateTimeout: NodeJS.Timeout;

function NoteText({ noteId, startingNoteText, startingNoteTitle }: Props) {
	const noteIDParam = useSearchParams().get("noteId") || "";
	const { noteText, setNoteText } = useNote();
	const { noteTitle, setNoteTitle } = useNote();

	useEffect(() => {
		if (noteIDParam === noteId) {
			setNoteText(startingNoteText);
			setNoteTitle(startingNoteTitle);
		}
	}, [
		startingNoteText,
		startingNoteTitle,
		noteIDParam,
		noteId,
		setNoteText,
		setNoteTitle,
	]);

	const handleTextUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		const type = e.target.type;

		setNoteText(text);

		clearTimeout(textUpdateTimeout);
		textUpdateTimeout = setTimeout(() => {
			updateNoteAction(noteId, text, type);
		}, debounceTimeout);
	};

	const handleTitleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		const type = e.target.type;

		setNoteTitle(text);

		clearTimeout(titleUpdateTimeout);
		titleUpdateTimeout = setTimeout(() => {
			updateNoteAction(noteId, text, type);
		}, debounceTimeout);
	};

	return (
		<>
			<Input
				value={noteTitle}
				onChange={handleTitleUpdate}
				placeholder="Title..."
				className="custom-scrollbar placeholder:text-muted-foreground mb-2 h-1 max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<Textarea
				value={noteText}
				onChange={handleTextUpdate}
				placeholder="Type here..."
				className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
			></Textarea>
		</>
	);
}

export default NoteText;
