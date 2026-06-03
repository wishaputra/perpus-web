import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  onSearchFilter?: (item: T, query: string) => boolean;
  itemsPerPage?: number;
}

export function Table<T>({
  data,
  columns,
  loading = false,
  searchPlaceholder = 'Cari data...',
  onSearchFilter,
  itemsPerPage = 5
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filtering if filter callback is provided
  const filteredData = onSearchFilter && searchQuery
    ? data.filter(item => onSearchFilter(item, searchQuery))
    : data;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page on search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search Header */}
      {onSearchFilter && (
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)' 
            }} 
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="form-input"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      )}

      {/* Table Body */}
      <div className="table-wrapper animate-fade">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading shimmers
              Array.from({ length: itemsPerPage }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx}>
                      <div style={{
                        height: '16px',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loadingShimmer 1.5s infinite',
                        borderRadius: '4px'
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    <Inbox size={40} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.95rem' }}>Data tidak ditemukan</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Content rows
              paginatedData.map((item, rIdx) => (
                <tr key={rIdx} className="animate-fade" style={{ animationDelay: `${rIdx * 0.05}s` }}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>{col.render(item, startIndex + rIdx)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ 
              alignSelf: 'center', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              padding: '0 8px',
              fontFamily: 'var(--font-title)'
            }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Keyframe shimmer animation added on demand */}
      <style>{`
        @keyframes loadingShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
