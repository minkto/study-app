import { ListingPageSizes } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
    const [queryFilters, setQueryFilters] = useState('');
    const [queryParamsLoaded, setQueryParamsLoaded] = useState(false);
    const hasInitialized = useRef(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const submitSearch = useCallback((value: string) => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        setSearch(value);
    }, []);

    const submitFilters = useCallback((value: string) => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        setQueryFilters(value);
    }, []);


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

        // Filters
        const filterParams = new URLSearchParams(queryFilters);
        filterParams.forEach((v, k) => params.append(k, v));

        return params.size > 0 ? "?" + params.toString() : "";
    }, [sorting, pagination.pageIndex, search, queryFilters]);


    const constructQueryString = useCallback(() => {

        return constructQueryStringLocal();

    }, [constructQueryStringLocal]);


    const getSortByQueryParamValues = useCallback((): SortQueryFilters => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortByValue = params.get('sortBy') ?? "";
        const sortOrderValue = params.get('sortOrder') ?? "";

        return {
            sortByValue: sortByValue,
            sortOrderValue: sortOrderValue
        }
    }, [searchParams])

    const getSearchTermQueryParamValues = useCallback((): string => {
        const params = new URLSearchParams(searchParams?.toString());
        const searchTermValue = params.get('search-term') ?? "";

        return searchTermValue;

    }, [searchParams])

    const getFilterParamValues = useCallback((): string => {

        const params = new URLSearchParams(searchParams?.toString());
        const filterParams = new URLSearchParams();

        params.forEach((v, k) => {
            if (k !== "search-term" && k !== "sortBy" && k !== "sortOrder" && k !== "page") {
                filterParams.append(k, v)
            }
        });

        return filterParams?.toString();

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

    const setupInitialSearchTerm = useCallback(() => {
        const searchTerm = getSearchTermQueryParamValues();

        if (!isStringEmpty(searchTerm)) {
            setSearch(searchTerm);
        }

    }, [getSearchTermQueryParamValues])

    const setupInitialFilters = useCallback(() => {
        const filterParams = getFilterParamValues();

        if (!isStringEmpty(filterParams)) {
            setQueryFilters(filterParams);
        }

    }, [getFilterParamValues])

    const setupInitialQueryParamsState = useCallback(() => {
        setupInitialSort();
        setupInitialSearchTerm();
        setupInitialFilters();
    }, [setupInitialSort, setupInitialSearchTerm, setupInitialFilters])


    // Only redirect when sorting changes and it's not the initial sort
    useEffect(() => {
        if (sorting.length > 0 && syncWithQueryParams) {
            redirectWithQueryParams();
        }
    }, [sorting, syncWithQueryParams, redirectWithQueryParams]);

    // Upon Component Mount, set the sorting, search, and filters once
    useEffect(() => {
        if (syncWithQueryParams && !hasInitialized.current) {
            setupInitialQueryParamsState();
            hasInitialized.current = true;
        } 
        setQueryParamsLoaded(true);

    }, [setupInitialQueryParamsState, syncWithQueryParams]);

    return {
        constructQueryString,
        redirectWithQueryParams,
        submitSearch,
        setSorting,
        setPagination,
        submitFilters,
        sorting,
        pagination,
        searchParams,
        search,
        queryFilters,
        queryParamsLoaded
    };
}