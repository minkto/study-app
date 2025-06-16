import { Table } from '@tanstack/react-table'
import styles from './listings-pagination.module.css'

export const ListingsPagination = ({table} : { table: Table<any> }) => 
{
    return (<div className={styles["pagination-container"]} >
        <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'} </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
        <div>
            Page {table.getState().pagination.pageIndex + 1} of {table?.getPageCount() === 0 || isNaN(table?.getPageCount()) ? 1 : table.getPageCount().toLocaleString()}
        </div>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
        <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>{'>>'}</button>
    </div>)
}