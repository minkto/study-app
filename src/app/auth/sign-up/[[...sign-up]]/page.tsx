import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up | LearnLobe',
  description: 'Sign up to start getting a handle on resources you which to learn from.',
}

export default function Page()
{
    return <SignUp />
}