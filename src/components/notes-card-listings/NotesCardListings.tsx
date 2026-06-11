import { Note } from "@/shared.types";
import NotesCard from "../notes-card/NotesCard";

interface NotesCardListingsProps {
    notes: Note[];
}

export const NotesCardListings = ({ notes }: NotesCardListingsProps) => {

    return (
        notes.map((n,index) => (
            <div key={n.noteId}>
                <NotesCard note={n} noteNumber={index + 1} ></NotesCard>
            </div>))

    )
}

export default NotesCardListings;