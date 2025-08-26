"use client";

import { useState } from "react";
import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";
import { AIChatMessages, AIChatApiResponse } from "@/shared.types";

const AIChatContainer = () => {

    const [currentRequestMessage, setCurrentRequestMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<AIChatMessages>({ messages: [] });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getResourcesFromOpenAI(prompt: string) : Promise<AIChatApiResponse> {
        try {
            const response = await fetch(`/api/ai/chat`, {
                method: 'POST',
                body: JSON.stringify({ prompt }),
            });

           const body = await response.json(); 

           return {resources: body.resources};

        } catch (error) {
            console.error("Error fetching resources from OpenAI:", error);
            return { resources: [] }; // Return an empty array on error
        }
    }

    const handleOnSubmit = (text: string) => {
        const inputValue = text?.trim() || "";

        if (inputValue !== "") {
            addRequestMessage(inputValue);
        }
    };

    const addRequestMessage = async (text: string) => {
        try {
            setIsLoading(true);
            setCurrentRequestMessage(text);

            const result = await getResourcesFromOpenAI(text); // waits 3 seconds

            // TODO: Handle the result from OpenAI based on responses.

            // TODO: Construct response message based on the result from OpenAI.
            // For now, we will use a placeholder response message.
            setChatMessages(prevChatMessages => ({
                messages: [...prevChatMessages.messages,
                {
                    requestMessage: text,
                    responseMessage: `I have found ${result.resources?.length || 0} resources for you.`,
                    responseObject: result
                }]
            }));

        } catch (error) {
            console.error("Error adding request message:", error);
            return;
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar onSearchSubmit={handleOnSubmit} isLoading={isLoading} />
            <AIChatWindow currentRequestMessage={currentRequestMessage} chatMessages={chatMessages} isLoading={isLoading} />
        </div>
    );
}

export default AIChatContainer;