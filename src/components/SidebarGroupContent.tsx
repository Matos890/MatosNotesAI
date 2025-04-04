"use client";

import { Notes } from "@prisma/client";
import {
  SidebarGroupContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import {  SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = { notes: Notes[] };

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchext] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuseInstance = useMemo(() => {
    return new fuse(localNotes, {
      keys: ["text"],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filteredNotes = searchText
    ? fuseInstance.search(searchText).map((result) => result.item)
    : localNotes;
  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId),
    );
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-2" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchext(e.target.value)}
        />
      </div>
      <SidebarMenu className="mt-4">
        {filteredNotes.map((note) => (
          <SidebarMenuItem key={note.id} className="group/item">
            <SelectNoteButton notes={note} />
            <DeleteNoteButton
              noteId={note.id}
              deleteNoteLocally={deleteNoteLocally}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
