"use client";

import { useState } from "react";
import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";

const AIChatContainer = () => {

    const [requestMessages, setRequestMessages] = useState<string[]>([]);
 
    const handleOnSubmit = (text: string) => {
        const inputValue = text?.trim() || "";

        if( inputValue !== "") {
            addRequestMessage(inputValue);
        }   
    };

    const addRequestMessage = (text: string) => {
        setRequestMessages(prevMessages => [...prevMessages, text]);
    }

    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar onSearchSubmit={handleOnSubmit} />
            <AIChatWindow messages={requestMessages}   />
        </div>
    );
}

export default AIChatContainer;