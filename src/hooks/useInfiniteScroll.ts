import { useEffect, useState } from "react";

const useInfiniteScroll = (loadMore) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isFetching) {
      return;
    }
    loadMore();
  }, [isFetching, loadMore]);

  function handleScroll({ currentTarget }) {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      setIsFetching(true);
    }
  }

  return { isFetching, setIsFetching, handleScroll };
};

export default useInfiniteScroll;
