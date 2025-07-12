"use client";

import { Note } from "@/app/generated/prisma";
import useNote from "@/hooks/useNote";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
    note: Note,
};

function SelectNoteButton({ note }: Props) {

    const noteId = useSearchParams().get("noteId") || "";
    const blankNoteText = "EMPTY NOTE";
    const {noteText: selectedNoteText} = useNote();
    
    const [localNoteText, setLocalNoteText] = useState(note.text);
    const [useGlobalNoteText, setUseGlobalNoteText] = useState(false);

    let noteText = localNoteText || blankNoteText;

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
        }
    }, [selectedNoteText, useGlobalNoteText]);

    if (useGlobalNoteText) {
        noteText = selectedNoteText || blankNoteText;
    }

  return (
    <SidebarMenuButton asChild className={`items-start gap-0 pr-12 ${note.id === noteId && "bg-sidebar-accent/50"}`}>
        <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
            <p className="w-full truncate">
                {noteText}
            </p>
            <p className="text-xs text-muted-foreground">
                {note.updatedAt.toLocaleDateString()}
            </p>
        </Link>
    </SidebarMenuButton>
  )
}

export default SelectNoteButton
