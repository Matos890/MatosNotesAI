'use client';
// This component is a button that creates a new note when clicked. It uses the Supabase client to create a new note in the database and then redirects the user to the new note's page.
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";

type Props = {
  user: User | null; // Assuming user is a string, adjust as necessary
};
function NewNoteButton({ user }: Props) {
  console.log(user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClickNewNoteButton = async () => {
  if (!user) {
    router.push("/login");
  }else {
    setLoading(true);
    const uuid = uuidv4();
    //uuidv4() is a function that generates a random UUID (Universally Unique Identifier). It is used to create a unique identifier for the new note.
    await createNoteAction(uuid);
    router.push(`/?noteId=${uuid}`);
    toast.success("New note created");
    setLoading(false);
  }};
  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant={"secondary"}
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "new note"}
    </Button>
  );
}

export default NewNoteButton;
