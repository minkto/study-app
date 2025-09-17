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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface ListingsSearchBoxProps {
  onSearchSubmit?: () => void;
  handleBeforeOnSearchSubmit?: () => void;
}

export const ListingsSearchBox = ({ onSearchSubmit,handleBeforeOnSearchSubmit }: ListingsSearchBoxProps) => {
  const [isPending, startTransition] = useTransition();
  const [currentText, setCurrentText] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSubmitted = useRef(false);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentText(event.target.value);
  }

  const handleOnSubmitSearch = () => {

    const currentSearchParams = new URLSearchParams(searchParams?.toString());
    const currentSearchTerm = currentSearchParams.get('search-term') ?? '';

    if (currentSearchTerm?.localeCompare(currentText, undefined, { sensitivity: 'accent' }) === 0) {
      return;
    }


    if(handleBeforeOnSearchSubmit)
    {
      handleBeforeOnSearchSubmit();
    }

    hasSubmitted.current = true;

    startTransition(() => {
      const currentSearchParams = new URLSearchParams(searchParams?.toString());
      const trimmedSearchTerm = currentText.trim();

      if (trimmedSearchTerm.length > 0) {
        currentSearchParams.set('search-term', trimmedSearchTerm);
        router.push(`${pathname}?${currentSearchParams.toString()}`);
      } else {
        currentSearchParams.delete('search-term');
        router.replace(`${pathname}?${currentSearchParams.toString()}`);
      }
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

  // Trigger onSearchSubmit only after param changes
  useEffect(() => {
    if (hasSubmitted.current) {
      hasSubmitted.current = false;
      onSearchSubmit?.();
    }
  }, [searchParams?.toString()])

  return (
    <div className={styles['search-box-listing']}>
      <input
        onKeyDown={handleOnKeyPress}
        value={currentText}
        onChange={handleTextChange}
        className={styles['search-box-listing__text']}
        type="text"
      />
      <button
        onClick={handleOnSubmitSearch}
        className={styles['search-box-listing__submit-btn']}
      >
        <IconSearch width={20} height={20} />
      </button>
    </div>
  )
}

export default ListingsSearchBox;