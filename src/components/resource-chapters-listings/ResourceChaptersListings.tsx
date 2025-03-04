import { Chapter } from "@/shared.types";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import styles from './resource-chapters-listings.module.css'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        tdClassName?: (cell: CellContext<TData, TValue>) => string,
    }
};

const ResourceChaptersListings = () => {

    const ChapterStatuses =
    {
        NOT_STARTED: 0,
        IN_PROGRESS: 1,
        COMPLETED: 2,
        INVALID: 3
    };

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
            cell: () => {
                return (<div><button>...</button>
                </div>
                )
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch('/api/resources/1/chapters');
                const data = await response.json();
                setData(data);
            }
            catch (error) {
                console.log("An error has occurred in the API: ", error);
            }
        };

        fetchChapters();
    }, []);

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