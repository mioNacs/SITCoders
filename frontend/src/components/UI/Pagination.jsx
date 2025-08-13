import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  hasMore = false,
  onPageChange,
  loading = false,
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateUrlParams = (page) => {
    const searchParams = new URLSearchParams(location.search);
    if (page === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    
    const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
    
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      updateUrlParams(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && hasMore && !loading) {
      updateUrlParams(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && !loading) {
      updateUrlParams(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={`flex justify-center items-center space-x-2 mt-6 ${className}`}>
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        className={`
          px-3 py-2 rounded-lg border transition-all duration-200 flex items-center space-x-1
          ${currentPage === 1 || loading 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <FaChevronLeft size={12} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                disabled={loading}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-200 min-w-[40px]
                  ${page === currentPage
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : loading
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }
                `}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages || !hasMore || loading}
        className={`
          px-3 py-2 rounded-lg border transition-all duration-200 flex items-center space-x-1
          ${currentPage >= totalPages || !hasMore || loading
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <FaChevronRight size={12} />
      </button>

      {loading && (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-orange-600"></div>
          <span className="text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
