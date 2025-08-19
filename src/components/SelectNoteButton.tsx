"use client";

import { Note } from "@/app/generated/prisma";
import useNote from "@/hooks/useNote";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import { blankNoteText, blankNoteTitle } from "@/lib/constants";
import Link from "next/link";

type Props = { note: Note };

function SelectNoteButton({ note }: Props) {
	const noteId = useSearchParams().get("noteId") || "";
	const { noteText: selectedNoteText, noteTitle: selectedNoteTitle } =
		useNote();

	const [localNoteText, setLocalNoteText] = useState(note.text);
	const [localNoteTitle, setLocalNoteTitle] = useState(note.title);
	const [useGlobalNoteText, setUseGlobalNoteText] = useState(false);

	let noteText = localNoteText || blankNoteText;
	let noteTitle = localNoteTitle || blankNoteTitle;

	//to prevent previous note data to flash on selecting a new note
	useEffect(() => {
		if (noteId === note.id) {
			setUseGlobalNoteText(true);
		} else {
			setUseGlobalNoteText(false);
		}
	}, [noteId, note.id]);

	useEffect(() => {
		if (useGlobalNoteText) {
			setLocalNoteText(selectedNoteText);
			setLocalNoteTitle(selectedNoteTitle);
		}
	}, [selectedNoteText, selectedNoteTitle, useGlobalNoteText]);

	if (useGlobalNoteText) {
		noteText = selectedNoteText || blankNoteText;
		noteTitle = selectedNoteTitle || blankNoteTitle;
	}

	return (
		<SidebarMenuButton
			asChild
			className={`items-start gap-0 pr-12 ${note.id === noteId && "bg-sidebar-accent/50"}`}
		>
			<Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
				<p className="w-full truncate">
					{noteTitle !== blankNoteTitle ? noteTitle : noteText}
				</p>
				<p className="text-muted-foreground text-xs">
					{note.updatedAt.toLocaleDateString()}
				</p>
			</Link>
		</SidebarMenuButton>
	);
}

export default SelectNoteButton;
