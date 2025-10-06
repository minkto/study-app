import { UserProfile } from "@clerk/nextjs";

export default async function Page() {
  return (
    <div>
      <h1>User Profile</h1>
      <UserProfile/>
    </div>)
}