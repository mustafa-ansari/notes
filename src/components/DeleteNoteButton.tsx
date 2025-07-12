"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteNoteAction } from "@/actions/notes";

type Props = {
    noteId: string;
    deleteLocalNote: (noteId: string) => void;
}

function DeleteNoteButton({ noteId, deleteLocalNote }: Props) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const noteIdParam = useSearchParams().get("noteId") || "";

    const handleDeleteNote = () => {

        startTransition(async () => {

            const {errorMessage} = await deleteNoteAction(noteId);

            if (!errorMessage) {
                toast.success("Note Deleted", {
                    description: "You've successfully deleted the note",
                });

                deleteLocalNote(noteId);

                if (noteId === noteIdParam) {
                    router.replace("/");
                }
            } else {
                toast.error("Error", {
                    description: "An error occurred"
                });
            }
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3" variant="ghost">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-shadow-destructive hover:bg-destructive/90 w-24">
                        {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteNoteButton
