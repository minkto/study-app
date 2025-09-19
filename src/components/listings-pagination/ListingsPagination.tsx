import { Table } from '@tanstack/react-table'
import styles from './listings-pagination.module.css'

interface ListingsPaginationProps<TData> {
    table: Table<TData>;
    handleBeforeButtonClick?: () => void;
}

export const ListingsPagination = <TData,>({ table, handleBeforeButtonClick }: ListingsPaginationProps<TData>) => {
    const handleOnPaginationButtonClick = () => {
        if (handleBeforeButtonClick) {
            handleBeforeButtonClick();
        }
    }

    return (<div className={styles["pagination-container"]} >
        <button onClick={() => { handleOnPaginationButtonClick(); table.firstPage() }} disabled={!table.getCanPreviousPage()}>{'<<'} </button>
        <button onClick={() => { handleOnPaginationButtonClick(); table.previousPage() }} disabled={!table.getCanPreviousPage()}>{'<'}</button>
        <div>
            Page {table.getState().pagination.pageIndex + 1} of {table?.getPageCount() === 0 || isNaN(table?.getPageCount()) ? 1 : table.getPageCount().toLocaleString()}
        </div>
        <button onClick={() => { handleOnPaginationButtonClick(); table.nextPage() }} disabled={!table.getCanNextPage()}>{'>'}</button>
        <button onClick={() => { handleOnPaginationButtonClick(); table.lastPage() }} disabled={!table.getCanNextPage()}>{'>>'}</button>
    </div>)
}