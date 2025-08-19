import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";

const AIChatContainer = () => {
    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar />
            <AIChatWindow />
        </div>
    );
}

export default AIChatContainer;