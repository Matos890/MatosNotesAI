"use client";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogOut = async () => {
    setLoading(true);
    const errorMessage = await logOutAction() ;
    if (!errorMessage) {
      toast.success("you successfully logged out");
      router.push("/");
    }else{
        toast.error('there has been a problem')
    }
    setLoading(false);
    console.log("logging out...");
  };
  return (
    <Button
      disabled={loading}
      onClick={handleLogOut}
      variant="outline"
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log out"}
    </Button>
  );
}

export default LogoutButton;
