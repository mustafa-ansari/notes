"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { askAIAction } from "@/actions/notes";
import "@/styles/ai-response.css"

type Props = {
    user: User | null;
};

function AskAIButton({ user }: Props) {
    
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);


    const handleOpenChange = (isOpen: boolean) => {
        if (!user) {
            router.push("/login");
        } else {
            if (isOpen) {
                setQuestionText("");
                setQuestions([]);
                setResponses([]);
            }
            setOpen(isOpen);
        }
    };

    const handleInput = () => {
        const textArea = textAreaRef.current;
        if (!textArea) return;

        textArea.style.height = "auto";
        textArea.style.height = `${textArea.scrollHeight}px`;
    };

    const handleClickInput = () => {
        textAreaRef.current?.focus();
    };

    const scrollToBottom = () => {
        contentRef.current?.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleSubmit = () => {
        if (!questionText.trim()) return;

        const updatedQuestions = [...questions, questionText];
        setQuestions(updatedQuestions);
        setQuestionText("");
        setTimeout(scrollToBottom, 100);

        startTransition(async () => {
            const response = await askAIAction(updatedQuestions, responses);
            setResponses(prev => [...prev, response]);

            setTimeout(scrollToBottom, 100);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
            <DialogTrigger asChild>
                <Button variant="secondary">Ask AI</Button>
            </DialogTrigger>
            <DialogContent 
                className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
                ref={contentRef}    
            >
                <DialogHeader>
                    <DialogTitle>Ask about your notes</DialogTitle>
                    <DialogDescription>
                        Our AI can answer questions about all your notes
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex flex-col gap-8">
                    {questions.map((question, index) => (
                        <Fragment key={index}>
                            <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                                {question}
                            </p>
                            {responses[index] && (
                                <p 
                                    className="bot-response text-muted-foreground text-sm"
                                    dangerouslySetInnerHTML={{ __html: responses[index] }}
                                />
                            )}
                        </Fragment>
                    ))}
                    {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
                </div>

                <div className="mt-auto flex flex-row cursor-text rounded-lg border p-4" onClick={handleClickInput}>
                    <Textarea
                        ref={textAreaRef}
                        placeholder="Ask anything about your notes..."
                        className="placeholder:text-muted-foreground resize-none rounded-sm border-none p-1.5 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
                        style={{
                            minHeight: "0",
                            lineHeight: "normal",
                        }}
                        rows={1}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                    <Button className="ml-auto size-8 rounded-full flex self-center">
                        <ArrowUpIcon className="text-background" />
                    </Button>
                </div>
                
            </DialogContent>
      </form>
    </Dialog>
  )
}

export default AskAIButton
