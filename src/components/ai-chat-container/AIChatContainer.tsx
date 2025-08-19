"use client";

import { useState } from "react";
import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";
import { AIChatMessages } from "@/shared.types";

const AIChatContainer = () => {

    const [chatMessages, setChatMessages] = useState<AIChatMessages>({messages:[]}); 
    const handleOnSubmit = (text: string) => {
        const inputValue = text?.trim() || "";

        if( inputValue !== "") {
            addRequestMessage(inputValue);
        }   
    };

    const addRequestMessage = (text: string) => {
        setChatMessages(prevChatMessages => ({
            messages: [...prevChatMessages.messages, 
                { requestMessage: text, responseMessage: `AI: This is my response to your idea.` }]
        }));
    }

    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar onSearchSubmit={handleOnSubmit} />
            <AIChatWindow chatMessages={chatMessages}  />
        </div>
    );
}

export default AIChatContainer;