import AIChatContainer from "@/components/ai-chat-container/AIChatContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Helper | LearnLobe',
  description: 'Use AI in assisting to create resources that can be used from the web.',
}

export default function Page() {
    return (
        <AIChatContainer/>
    );
}