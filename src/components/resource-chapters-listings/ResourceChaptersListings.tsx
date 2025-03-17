import { Chapter } from "@/shared.types";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, Row, RowData, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import styles from './resource-chapters-listings.module.css'
import CardDropdownMenu from "../card-dropdown-menu/CardDropdownMenu";
import { ChapterStatuses } from "@/constants/constants";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        tdClassName?: (cell: CellContext<TData, TValue>) => string,
    }
};

interface ResourceChaptersListingsProps {
    resourceId?: string
}

const ResourceChaptersListings = ({ resourceId }: ResourceChaptersListingsProps) => {

    const statusMapping = {
        [ChapterStatuses.NOT_STARTED]: { text: "Not Started", class: "progress--not-started" },
        [ChapterStatuses.IN_PROGRESS]: { text: "In Progress", class: "progress--in-progress" },
        [ChapterStatuses.COMPLETED]: { text: "Completed", class: "progress--completed" },
    };

    const [data, setData] = useState<Chapter[]>([]);
    const columnHelper = createColumnHelper<Chapter>();
    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
        }),
        columnHelper.accessor('statusId', {
            cell: (info) => {
                const value = info.getValue();

                // Get the corresponding status
                const status = statusMapping[value ?? ChapterStatuses.NOT_STARTED] || { text: "Unknown", class: "progress--unknown" };
                return status.text;
            },
            header: () => <span>Status</span>,
            meta: {
                tdClassName: (info) => {
                    const value = info.getValue();
                    return styles[statusMapping[value ?? ChapterStatuses.NOT_STARTED].class || "progress--unknown"]; //
                }
            }
        }),
        columnHelper.accessor('originalDateCompleted', {
            cell: (info) => {
                const date = info.getValue();
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
            header: () => <span>Original Date Completed</span>,
        }),
        columnHelper.accessor('lastDateCompleted', {
            cell: (info) => {
                const date = info.getValue();
                return date ? new Date(date).toLocaleDateString() : 'N/A';
            },
            header: () => <span>Last Date Completed</span>,
        }),
        columnHelper.accessor('daysSinceCompleted', {
            cell: info => info.getValue(),
            header: () => <span>Days Since Last Completed</span>,
        }),
        {
            id: 'menuOptions',
            header: () => null,
            cell: ({ row }: { row: Row<Chapter> }) => {
                const chapterId = row.original.chapterId
                return (
                    <CardDropdownMenu links={
                        [
                            { label: "Edit Chapter", href: `chapters/${chapterId}/edit-chapter` },
                            {
                                label: "Delete Chapter",  
                                onClick: async () => {
                                    try {
                                        await deleteChapter(chapterId);
                                        await fetchChapters(resourceId);
                                    } catch (error) {
                                        console.error("Failed to delete chapter:", error);
                                    }
                                },
                            }
                        ]
                    } />
                )
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const fetchChapters = async (resourceId: string | undefined) => {
        try {
            if (resourceId === undefined) {
                console.log("Could not find resource Id from the URL");
                return;
            }
            const response = await fetch(`/api/resources/${resourceId}/chapters`);
            const data = await response.json();
            setData(data);
        }
        catch (error) {
            console.log("An error has occurred in the API: ", error);
        }
    };

    const deleteChapter = async (chapterId: number | undefined) => {
        try {
            if (resourceId === undefined) {
                console.log("Could not find Chapter Id from the URL");
                return;
            }
            const response = await fetch(`/api/chapters/${chapterId}`, {method: 'DELETE'});
            const data = await response.json();
            setData(data);
        }
        catch (error) {
            console.log("An error has occurred in the API: ", error);
        }
    };
    
    useEffect(() => {
        fetchChapters(resourceId);
    }, [resourceId]);

    console.log('Chapter Data: ', data);

    return (<div className="chapter-listings">
        <table className={styles["table-container"]} cellPadding={0} cellSpacing={0}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th className={styles["table-head-cell"]} key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr className={`${styles["table-row"]}`} key={row.id}>
                        {row.getVisibleCells().map(cell => {
                            const tdClass = cell.column.columnDef.meta?.tdClassName
                                ? cell.column.columnDef.meta.tdClassName(cell.getContext())
                                : "";

                            return (<td className={`${styles["table-row-data"]} ${tdClass}`} key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>)
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
};

export default ResourceChaptersListings;