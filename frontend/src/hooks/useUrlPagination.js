import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useUrlPagination = (defaultPage = 1, defaultLimit = 15) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page from URL params
  const getPageFromUrl = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 15) : defaultPage;
    return isNaN(page) || page < 1 ? defaultPage : page;
  }, [location.search, defaultPage]);

  const [currentPage, setCurrentPage] = useState(getPageFromUrl);
  const [limit] = useState(defaultLimit);

  // Update page when URL changes
  useEffect(() => {
    const pageFromUrl = getPageFromUrl();
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [location.search, getPageFromUrl, currentPage]);

  // Function to update URL with new page
  const updateUrlPage = useCallback((page) => {
    const searchParams = new URLSearchParams(location.search);
    
    if (page === 1 || page === defaultPage) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    
    const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
  }, [location.pathname, location.search, navigate, defaultPage]);

  // Function to go to specific page
  const goToPage = useCallback((page) => {
    if (page < 1) page = 1;
    setCurrentPage(page);
    updateUrlPage(page);
  }, [updateUrlPage]);

  // Function to go to next page
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // Function to go to previous page
  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Function to reset to first page
  const resetPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  return {
    currentPage,
    limit,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
    updateUrlPage
  };
};
