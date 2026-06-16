"use client";

import { Note } from "@/shared.types";
import NotesCard from "../notes-card/NotesCard";
import styles from './notes-card-listings.module.css';
import { useCallback, useEffect, useState } from "react";
import AddNoteLink from "../add-note-link/AddNoteLink";
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";

interface NotesCardListingsProps {
    chapterId: number;
}

export const NotesCardListings = ({ chapterId }: NotesCardListingsProps) => {

    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const getNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!chapterId) {
                return;
            }
            const response = await fetch(`/api/chapters/${chapterId}/notes/`);
            const data = await response.json();
            if (response.ok) {
                setNotes(data);
            } else {
                setNotes([]);
            }

        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [chapterId])

    useEffect(() => {
        getNotes();
    }, [getNotes])

    return (
        <div className={styles["notes-card-listings"]}>
            {isLoading ? <EllipsesLoader message="Loading Notes." /> :
                <>
                    <AddNoteLink onAddNote={getNotes} />
                    <div className={styles["notes-card-listings__items"]}>
                        {notes.map((n, index) => (
                            <NotesCard
                                onCardChanged={getNotes}
                                key={n.noteId}
                                note={n}
                                noteNumber={index + 1}
                            />
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default NotesCardListings;