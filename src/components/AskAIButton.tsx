"use client";

import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon } from "lucide-react";

type Props = { user: User };
function AskAIButton({ user }: Props) {
  const [isPending, startTransition]=useTransition()
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  console.log("user", user);
  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText('')
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null); 
  const contentRef = useRef<HTMLDivElement>(null);
  const handleInput = ()=>{
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // Reset the height to auto to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height

  }
  const handleClickInput = ()=>{
    textareaRef.current?.focus()
  }
  const scrollToBottom = () => { contentRef.current?.scrollTo({top: contentRef.current.scrollHeight, behavior: 'smooth' }); };
  const handleSubmit = ()=>{
    if (!questionText.trim()) return; // Prevent empty questions
const newQuestions = [...questions, questionText];
setQuestions(newQuestions);
setQuestionText("");
setTimeout(scrollToBottom,100); // Scroll to the bottom after a short delay to ensure the new question is rendered
startTransition(async () => {
  const response = await askAIAboutNotesActions(newQuestions, responses)
  setResponses((prevResponses) => [...prevResponses, response]);
  setTimeout(scrollToBottom,100); // Scroll to the bottom after a short delay to ensure the new response is rendered
  })
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } // Prevent default behavior of Enter key} 
  }
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar flex h-[85vh] flex-col overflow-y-auto "ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Ask AI About your notes</DialogTitle>
          <DialogDescription>
          Out AI now will answer your questions about your notes
          </DialogDescription>
        </DialogHeader> <div className="mt-4 flex flex-col gap-8">
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

        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
          <Button className="ml-auto size-8 rounded-full">
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;
