import { useState, useLayoutEffect, useCallback, RefObject } from 'react';

interface UseInfiniteScrollParams {
  scrollRef: RefObject<HTMLDivElement>;
  fetchData: () => Promise<void>;
  scrollToTop?: boolean;
}

const useInfiniteScroll = ({
  scrollRef,
  fetchData,
  hasMoreData,
  scrollToTop = false
}: UseInfiniteScrollParams & { hasMoreData: boolean }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const onScroll = useCallback(() => {
    if (!scrollRef.current || isFetching || !hasMoreData) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setScrollPosition(scrollTop);

    let triggerFetch = false;
    if (scrollToTop) {
      if (scrollTop === 0) triggerFetch = true;
    } else {
      if (scrollHeight - scrollTop <= clientHeight * 1.1) triggerFetch = true;
    }

    if (triggerFetch) {
      setIsFetching(true);
      fetchData().then(() => {
        setIsFetching(false);
      });
    }
  }, [scrollRef, isFetching, fetchData, scrollToTop, hasMoreData, scrollPosition]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = scrollPosition;
    }
    element?.addEventListener('scroll', onScroll);
    return () => {
      element?.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  useLayoutEffect(() => {
    if (!isFetching && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollPosition;
        }
      });
    }
  }, [scrollRef, isFetching, scrollPosition]);

  return [isFetching];
};

export default useInfiniteScroll;
