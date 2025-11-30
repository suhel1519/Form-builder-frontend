import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api';
import { Submission } from '../types';
import SubmissionModal from '../components/SubmissionModal';
import EditSubmissionModal from '../components/EditSubmissionModal';

function SubmissionsPage() {
  const queryClient = useQueryClient();
  const { darkMode } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['submissions', page, limit, sortOrder, searchQuery],
    queryFn: () => api.getSubmissions(page, limit, 'createdAt', sortOrder, searchQuery),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteMutation.mutate(id);
    }
  };

  const exportToCSV = () => {
    if (!data?.data.length) return;

    // Get all field keys from first submission
    const firstSubmission = data.data[0];
    const headers = ['ID', 'Created Date', ...Object.keys(firstSubmission.data)];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.data.map(sub => {
        const row = [
          sub.id,
          new Date(sub.createdAt).toLocaleString(),
          ...Object.values(sub.data).map(val => {
            if (Array.isArray(val)) return `"${val.join('; ')}"`;
            return `"${String(val).replace(/"/g, '""')}"`;
          })
        ];
        return row.join(',');
      })
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: 'id',
      header: 'Submission ID',
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <span>Created Date</span>
          <span className="text-xs">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        </button>
      ),
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedSubmission(info.row.original)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View
          </button>
          <button
            onClick={() => setEditingSubmission(info.row.original)}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading submissions: {(error as Error).message}</p>
      </div>
    );
  }

  const pagination = data?.pagination;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Submissions
              </h1>
              {pagination && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Total: {pagination.totalCount} submissions
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={exportToCSV}
                disabled={!data?.data.length}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {data?.data.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {searchQuery ? 'No submissions found' : 'No submissions yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            darkMode ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label htmlFor="pageSize" className="text-sm text-gray-700">
                    Items per page:
                  </label>
                  <select
                    id="pageSize"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {editingSubmission && (
        <EditSubmissionModal
          submission={editingSubmission}
          onClose={() => setEditingSubmission(null)}
        />
      )}
    </div>
  );
}

export default SubmissionsPage;
