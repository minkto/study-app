'use client'

import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition
} from 'react'
import IconSearch from '../icons/icon-search/IconSearch'
import styles from './listings-search-box.module.css'
import { useSearchParams } from 'next/navigation'

interface ListingsSearchBoxProps {
  onSearchSubmit?: (e: string | undefined) => void;
  handleBeforeOnSearchSubmit?: () => void;
  useQueryParams?: boolean;
}

export const ListingsSearchBox = ({ onSearchSubmit, handleBeforeOnSearchSubmit, useQueryParams = true, }: ListingsSearchBoxProps) => {
  const [isPending, startTransition] = useTransition();
  const [currentText, setCurrentText] = useState('');
  const searchParams = useSearchParams();
  const hasSubmitted = useRef(false);
  const searchParamsString = searchParams.toString();

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentText(event.target.value);
  }


  const handleOnSubmitSearch = () => {

    if (!useQueryParams) {
      if (handleBeforeOnSearchSubmit) {
        handleBeforeOnSearchSubmit();
      }

      hasSubmitted.current = true;

      return;
    }

    const currentSearchParams = new URLSearchParams(searchParams?.toString());
    const currentSearchTerm = currentSearchParams.get('search-term') ?? '';

    if (currentSearchTerm?.localeCompare(currentText?.trim(), undefined, { sensitivity: 'accent' }) === 0) {
      return;
    }


    if (handleBeforeOnSearchSubmit) {
      handleBeforeOnSearchSubmit();
    }

    hasSubmitted.current = true;

    startTransition(() => {
      onSearchSubmit?.(currentText?.trim());
    })
  }

  const handleOnKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleOnSubmitSearch();
    }
  }

  const setupSearchBoxValue = useCallback(() => {
    const currentSearchParams = new URLSearchParams(searchParams?.toString());
    const trimmedSearchTerm = currentSearchParams.get('search-term')?.trim();
    setCurrentText(trimmedSearchTerm ?? '');
  }, [searchParams])

  // Keep input value in sync with search param
  useEffect(() => {
    setupSearchBoxValue();
  }, [setupSearchBoxValue])

  // Trigger onSearchSubmit only after the text has changed
  // and a submit has been commited.
  useEffect(() => {
    if (useQueryParams) {
      if (!hasSubmitted.current) {
        return;
      }
    }
    else {
      if (hasSubmitted.current) {
        hasSubmitted.current = false;
        onSearchSubmit?.(currentText?.trim());
      }
    }

  }, [searchParamsString, currentText, onSearchSubmit, useQueryParams])

  return (
    <div className={styles['search-box-listing']}>
      <input
        id='search-input-field'
        onKeyDown={handleOnKeyPress}
        value={currentText}
        onChange={handleTextChange}
        className={styles['search-box-listing__text']}
        type="text"
      />
      <button
        disabled={isPending}
        onClick={handleOnSubmitSearch}
        className={styles['search-box-listing__submit-btn']}
      >
        <IconSearch width={20} height={20} />
      </button>
    </div>
  )
}

export default ListingsSearchBox;