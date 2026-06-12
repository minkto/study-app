import { Note } from "@/shared.types";
import NotesCard from "../notes-card/NotesCard";
import styles from './notes-card-listings.module.css';

interface NotesCardListingsProps {
    notes: Note[];
}

export const NotesCardListings = ({ notes }: NotesCardListingsProps) => {

    return (
        <div className={styles["notes-card-listings"]}>
            {notes.map((n, index) => (
                <NotesCard key={n.noteId} note={n} noteNumber={index + 1} ></NotesCard>
            ))}
        </div>
    )
}

export default NotesCardListings;