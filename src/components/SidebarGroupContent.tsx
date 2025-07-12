"use client";

import { Note } from "@/app/generated/prisma";
import { SidebarGroupContent as SidebarGroupContentSCN, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
    notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
    
    const [searchText, setSearchText] = useState("");
    const [localNotes, setLocalNotes] = useState(notes);
    
    const fuse = useMemo(() => {
        return new Fuse(localNotes, {
            keys: ["text"],
            threshold: 0.4
        })
    }, [localNotes]);

    const filteredNotes = searchText ? fuse.search(searchText).map(result => result.item) : localNotes;
    const deleteLocalNote = (noteId: string) => {
        setLocalNotes((prevNotes) => 
            prevNotes.filter(note => note.id !== noteId)
        );
    };

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    return <SidebarGroupContentSCN>
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-4" />
            <Input
              className="bg-muted pl-8"
              placeholder="Search notes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
        </div>

        <SidebarMenu className="mt-4">
            {filteredNotes.map((note) => 
                <SidebarMenuItem key={note.id} className="group/item">
                    <SelectNoteButton note={note} />

                    <DeleteNoteButton noteId={note.id} deleteLocalNote={deleteLocalNote}/>
                </SidebarMenuItem>
            )}
        </SidebarMenu>


    </SidebarGroupContentSCN>
}

export default SidebarGroupContent
