"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { debounceTimeout } from "@/lib/constants";

interface RTEditorProps {
	content: string;
	onChange: (content: string) => void;
}

let editorTimeout: NodeJS.Timeout;

function RTEditor({ content, onChange }: RTEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "list-disc ml-3",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal ml-3",
					},
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Highlight,
		],
		content: content,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "overflow-y-scroll custom-scrollbar min-h-[60vh] max-h-[60vh] p-4",
			},
			scrollThreshold: 95,
			scrollMargin: 60,
		},
		onUpdate: ({ editor }) => {
			clearTimeout(editorTimeout);
			editorTimeout = setTimeout(() => {
				onChange(editor.getHTML());
			}, debounceTimeout);
		},
	});

	useEffect(() => {
		console.log("useEffect");
		editor?.commands.setContent(content, { emitUpdate: false });
	});

	console.log(content);

	return (
		<>
			<Toolbar editor={editor} />
			<EditorContent
				editor={editor}
				// className="custom-scrollbar max-h-2/5 resize-none overflow-y-scroll rounded-md border p-4"
				className="rounded-md border"
			/>
		</>
	);
}

export default RTEditor;
