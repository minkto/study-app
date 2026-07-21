import { UserProfile } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'User Profile | LearnLobe',
    description: 'View your profile details.',
}

export default async function Page() {
  return (
    <div>
      <h1>User Profile</h1>
      <UserProfile/>
    </div>)
}