import { ListingPageSizes } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SortQueryFilters {
    sortByValue: string;
    sortOrderValue: string;
}

interface UseDataTableQueryProps {
    pageSize?: number;
    syncWithQueryParams?: boolean;
}

export function useDataTableQueryParams({ pageSize = Number(ListingPageSizes.DEFAULT), syncWithQueryParams = false }: UseDataTableQueryProps) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize
    });
    const [search, setSearch] = useState('');

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const submitSearch = useCallback((value: string) => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        setSearch(value);
    }, []);

    const constructQueryStringSync = useCallback(() => {
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

        if (!isStringEmpty(search)) {
            params.set("search-term", search);
        }
        else {
            params.delete("search-term");
        }

        return params.size > 0 ? "?" + params.toString() : "";
    }, [searchParams, sorting, pagination.pageIndex, search]);

    const constructQueryStringLocal = useCallback(() => {
        const params = new URLSearchParams();
        const sortBy = sorting[0]?.id;
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        if (sorting.length > 0) {
            params.set("sortBy", sortBy!);
            params.set("sortOrder", sortOrder);
        }
        if (pagination.pageIndex > 0) {
            params.set("page", (pagination.pageIndex + 1).toString());
        }

        if (!isStringEmpty(search)) {
            params.set("search-term", search);
        }

        return params.size > 0 ? "?" + params.toString() : "";
    }, [sorting, pagination.pageIndex, search]);


    const constructQueryString = useCallback(() => {
        if (!syncWithQueryParams) {
            return constructQueryStringLocal();
        }
        else {
            return constructQueryStringSync();
        }

    }, [constructQueryStringSync, constructQueryStringLocal, syncWithQueryParams]);


    const getSortByQueryParamValues = useCallback((): SortQueryFilters => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortByValue = params.get('sortBy') ?? "";
        const sortOrderValue = params.get('sortOrder') ?? "";

        return {
            sortByValue: sortByValue,
            sortOrderValue: sortOrderValue
        }
    }, [searchParams])

    const redirectWithQueryParams = useCallback(() => {
        const queryString = constructQueryString();
        if (queryString) {
            router.push(queryString);
        }
        else {
            router.replace(`${pathname}${queryString}`);
        }
    }, [constructQueryString, pathname, router])

    const setupInitialSort = useCallback(() => {
        const sortQueryFilters = getSortByQueryParamValues();

        if (!isStringEmpty(sortQueryFilters.sortByValue) && !isStringEmpty(sortQueryFilters.sortOrderValue)) {
            const newSorting = [{
                id: sortQueryFilters.sortByValue,
                desc: sortQueryFilters.sortOrderValue.toLowerCase() === 'desc'
            }];

            setSorting(newSorting);
        }
    }, [getSortByQueryParamValues])


    // Only redirect when sorting changes and it's not the initial sort
    useEffect(() => {
        if (sorting.length > 0 && syncWithQueryParams) {
            redirectWithQueryParams();
        }
    }, [sorting, syncWithQueryParams, redirectWithQueryParams]);

    // Upon Component Mount, set the sorting.
    useEffect(() => {
        if (syncWithQueryParams) {
            setupInitialSort();
        }
    }, [syncWithQueryParams, setupInitialSort]);

    return {
        constructQueryString,
        redirectWithQueryParams,
        submitSearch,
        setupInitialSort,
        setSorting,
        setPagination,
        sorting,
        pagination,
        searchParams,
        search,
    };
}