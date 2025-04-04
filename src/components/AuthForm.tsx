"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};
function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (formData: FormData) => {
    console.log("form submitted");
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      let errorMessage;
      let title;
      let description;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = "logged in";
        description = "you have been successfully logged in";
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = "Signed up";
        description = "check your email for a confirmation link";
      }
      if (!errorMessage) {
        toast.success("yea");
        router.replace("/");
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          ></Input>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          ></Input>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "don't have an account yet?"
            : "already have an account? "}
        </p>
        <Link
          href={isLoginForm ? "/sign-up" : "/login"}
          className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
        >
          {isLoginForm ? "Sign up" : "Login"}
        </Link>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
