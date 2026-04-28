import { ListingPageSizes } from "@/constants/constants";
import { Chapter } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { getSortDirectionTitle } from "@/utils/tableUtils";
import { flexRender, Table } from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";

interface ChaptersDataTableProps {
    table: Table<Chapter>;
    dataLoaded: boolean;
}

const ChaptersDataTableListView = ({ table, dataLoaded }: ChaptersDataTableProps) => {
    return (
        <table className="table-container" cellPadding={0} cellSpacing={0}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th className={`table-head-cell`} key={header.id}>

                                    {header.isPlaceholder ? null : (
                                        <button
                                            className={
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={
                                                header.column.getCanSort()
                                                    ? (() => {
                                                        const nextOrder = header.column.getNextSortingOrder();
                                                        return getSortDirectionTitle(nextOrder);
                                                    })()
                                                    : undefined
                                            }
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </button>
                                    )}
                                </th>
                            )
                        }
                        )}
                    </tr>
                ))}
            </thead>
            <tbody>
                {!dataLoaded ? (
                    // Skeleton rows
                    [...Array(Number(process.env.CHAPTERS_MAX_PAGE_SIZE ?? ListingPageSizes.CHAPTERS))].map((_, i) => (
                        <tr className="table-row" key={`skeleton-${i}`}>
                            {table.getVisibleFlatColumns().map((col, j) => (
                                <td className="table-row-data" key={`skeleton-cell-${j}`}>
                                    <div style={{ width: '100%' }}>
                                        <Skeleton height={53} />
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    // Actual rows
                    table.getRowModel().rows.map(row => (
                        <tr className="table-row" key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                const tdClass = cell.column.columnDef.meta?.tdClassName
                                    ? cell.column.columnDef.meta.tdClassName(cell.getContext())
                                    : "";

                                const label = cell.column.columnDef.meta?.label
                                    ? `${cell.column.columnDef.meta.label}`
                                    : "";

                                const value = cell.getValue() as string;

                                return (
                                    <td
                                        className={`table-row-data ${tdClass ?? null}`}
                                        key={cell.id}
                                    >
                                        {!isStringEmpty(value) ? (<span className={"col-label-inline"}>{label}</span>) : (null)}
                                        <span>

                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                )}
            </tbody>
        </table>)
}

export default ChaptersDataTableListView;