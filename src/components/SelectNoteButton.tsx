"use client";

import useNote from "@/hooks/useNote";
import { Notes } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  notes: Notes;
};
 function SelectNoteButton({ notes }: Props) {
    const noteId =  useSearchParams().get("noteId") || "";
  const { noteText: selectedNoteText } = useNote();
  const [shouldBeGlobalNoteText, setShouldBeGlobalNoteText] = useState(false);
  const [localNoteText, setLocalNoteText] = useState(notes.text);
  useEffect(() => {
if(noteId === notes.id){
  setShouldBeGlobalNoteText(true); } else {
  setShouldBeGlobalNoteText(false);}

  }, [noteId, notes.id])
  useEffect(()=>{
if (shouldBeGlobalNoteText){
setLocalNoteText(selectedNoteText);}
  }, [shouldBeGlobalNoteText, selectedNoteText])
  const blankNoteText = "EMPTY NOTE";
  let noteText = localNoteText || blankNoteText;
  if (shouldBeGlobalNoteText){
    noteText = selectedNoteText || blankNoteText;
  }
  return <SidebarMenuButton asChild
  className={`items-start gap-0 pr-12 ${notes.id === noteId ? "bg-sidebar-accent/50" : '' } `}
  >
    <Link href={`/?noteId=${notes.id}`} className="flex h-fit flex-col ">
    <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
        {noteText}
    </p>
    <p className="text-xs text-muted-foreground">
    {notes.updatedAt.toLocaleDateString()}</p>
    </Link>
  </SidebarMenuButton>;
}

export default SelectNoteButton;
