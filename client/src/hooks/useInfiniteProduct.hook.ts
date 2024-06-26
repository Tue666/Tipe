import { productApi } from '@/apis';
import { LIMIT_SUGGESTION_NUMBER } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';
import { useState, useEffect } from 'react';

const useInfiniteProduct = () => {
  const [newest, setNewest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [infiniteProducts, setInfiniteProducts] = useState<
    IProduct.FindForSuggestionResponse['products']
  >([]);

  useEffect(() => {
    const findProducts = async () => {
      setIsLoading(true);
      const suggestion = await productApi.findForSuggestion({
        limit: LIMIT_SUGGESTION_NUMBER,
        newest,
      });
      const { products, pagination } = suggestion;
      setInfiniteProducts((prevProducts) => {
        return [...prevProducts, ...products];
      });
      setIsLoading(false);
      const isLastPage = pagination.currentPage >= pagination.totalPage;
      if (isLastPage) {
        setHasMore(false);
      }
    };

    findProducts();
  }, [newest]);

  const handleNextPage = () => {
    setNewest(newest + LIMIT_SUGGESTION_NUMBER);
  };
  return { handleNextPage, isLoading, hasMore, infiniteProducts };
};

export default useInfiniteProduct;
