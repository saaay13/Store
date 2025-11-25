import React from 'react';
import { Button } from '../atoms';
import { Icon } from '../atoms';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = ''
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={`flex justify-between items-center ${className}`}>
        <p className="text-sm text-gray-700">
          Mostrando {totalItems} {totalItems === 1 ? 'elemento' : 'elementos'}
        </p>
      </div>
    ) : null;
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${className}`}>
      {showInfo && (
        <p className="text-sm text-gray-700">
          Mostrando {startItem} a {endItem} de {totalItems} elementos
        </p>
      )}

      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon name="arrowLeft" size="sm" className="mr-1" />
          Anterior
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="min-w-10"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <Icon name="arrowRight" size="sm" className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;