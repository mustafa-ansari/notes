"use client";

import { Note } from "@/app/generated/prisma";

type Props = {
    notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
    console.log(notes);
    return <div>
        Your notes here
    </div>
}

export default SidebarGroupContent
