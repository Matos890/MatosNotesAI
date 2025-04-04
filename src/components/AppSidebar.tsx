import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Notes } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();
  let notes: Notes[] = [];

  if (user) {
    notes = await prisma.notes.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroupLabel className="text-large mt-2 mb-2">
          {user ? (
            "Your Notes"
          ) : (
            <p>
              <Link className="underline" href="/login">
                Log in
              </Link>{" "}
              to see your notes
            </p>
          )}
        </SidebarGroupLabel>
        {user && <SidebarGroupContent notes={notes} />}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
