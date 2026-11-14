
import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";

export function useProducts(params = {}) {
  const {
    pageNumber = 0,
    pageSize = 9,
    sortBy = "viewCount",
    sortDirection = "desc",
    search = "",
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    layout = null,
    connectionType = null,
    switchType = null,
    inStock = null,
  } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [reload, setReload] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productService.getProducts({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        search,
        categoryId,
        minPrice,
        maxPrice,
        layout,
        connectionType,
        switchType,
        inStock,
      });

      setProducts(result.products || []);
      setPageInfo(result.pageInfo);
      setIsLive(result.isLive);
      setError(result.error || null);
    } catch (err) {
      setProducts([]);
      setPageInfo(null);
      setIsLive(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    search,
    categoryId,
    minPrice,
    maxPrice,
    layout,
    connectionType,
    switchType,
    inStock,
  ]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await productService.getProducts({
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
          search,
          categoryId,
          minPrice,
          maxPrice,
          layout,
          connectionType,
          switchType,
          inStock,
        });

        if (cancelled) return;

        setProducts(result.products || []);
        setPageInfo(result.pageInfo);
        setIsLive(result.isLive);
        setError(result.error || null);
      } catch (err) {
        if (cancelled) return;

        setProducts([]);
        setPageInfo(null);
        setIsLive(false);
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    search,
    categoryId,
    minPrice,
    maxPrice,
    layout,
    connectionType,
    switchType,
    inStock,
    reload,
  ]);

  const refetch = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  return {
    products,
    loading,
    error,
    isLive,
    pageInfo,
    refetch,
  };
}
