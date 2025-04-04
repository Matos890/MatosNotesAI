'use client';

import { NoteProviderContext } from "@/app/providers/NoteProvider";
import { useContext } from "react";

function useNote() {
    const context = useContext(NoteProviderContext);
    if (!context) {
        throw new Error("useNote must be used within a NoteProvider");}
        return context;
    }
    export default useNote;
// This hook provides access to the note text and the function to update it.