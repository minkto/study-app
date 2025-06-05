import { ListingPageSizes } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useDataTableQueryParams(pageSize = ListingPageSizes.CHAPTERS ) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: parseInt(process.env.CHAPTERS_MAX_PAGE_SIZE || pageSize)
    });

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const constructQueryString = useCallback(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortBy = sorting[0]?.id;
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        if (sorting.length === 0) {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else {
            params.set("sortBy", sortBy!);
            params.set("sortOrder", sortOrder);
        }

        if (pagination.pageIndex > 0 || (pagination.pageIndex === 0 && params.get("page") !== null)) {
            params.set("page", (pagination.pageIndex + 1).toString());
        }

        return params.size > 0 ? "?" + params.toString() : "";
    }, [searchParams, sorting, pagination.pageIndex]);

    const redirectWithQueryParams = () => {
        const queryString = constructQueryString();
        if (queryString) {
            router.push(queryString);
        }
        else {
            router.replace(`${pathname}${queryString}`);
        }
    }

    const setupInitialSort = () => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortByValue = params.get('sortBy') ?? "";
        const sortOrderValue = params.get('sortOrder');

        if (!isStringEmpty(sortByValue) && !isStringEmpty(sortOrderValue)) {
            const newSorting = [{
                id: sortByValue,
                desc: sortOrderValue?.toLowerCase() === 'desc'
            }];

            setSorting(newSorting);
        }
    }

    // Upon Column Change, set the query string
    useEffect(() => {
        redirectWithQueryParams();
    }, [sorting, constructQueryString, router, pathname]);

    // Upon Component Mount, set the sorting.
    useEffect(() => {
        setupInitialSort();
    }, [searchParams]);

    return {
        constructQueryString,
        redirectWithQueryParams,
        setupInitialSort,
        setSorting,
        setPagination,
        sorting,
        pagination,
    };
}