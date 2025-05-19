import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface UseSearchParamOptions {
  paramName: string;
  value: string;
  delay?: number;
}

/**
 * A hook to manage search parameters in the URL
 * @param options Configuration options for the search parameter
 * @returns void
 */
export function useUpdateSearchParam({ paramName, value }: UseSearchParamOptions): void {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [value, paramName, router, searchParams]);
}