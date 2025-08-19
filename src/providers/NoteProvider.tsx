"use client";

import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteText: string;
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  setNoteText: (noteText: string) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteText: "",
  noteTitle: "",
  setNoteTitle: () => {},
  setNoteText: () => {},
});

function NoteProvider({ children }: { children: React.ReactNode }) {
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  return (
    <NoteProviderContext.Provider
      value={{ noteText, noteTitle, setNoteTitle, setNoteText }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
}

export default NoteProvider;
