import React, { useState, useMemo } from 'react';
import { FaMagnifyingGlass, FaPenToSquare, FaTrashCan, FaXmark } from 'react-icons/fa6';

// Helper function to format date cleanly (DD/MM/YY)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const parts = String(dateString).split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.slice(-2)}`;
  }
  return dateString;
};

export default function TransactionList({
  transactions = [],
  categories = [],
  onEdit,
  onDelete,
  loading = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return transactions
      .filter((t) => {
        if (!t) return false;
        const description = t.description || '';
        const matchesSearch = description.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesCat =
          selectedCategory === 'ALL' ||
          (selectedCategory === 'OTHERS'
            ? !t.categoryId || !categories.some((c) => c.id === t.categoryId)
            : t.categoryId === selectedCategory);
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        const amountA = Number(a.amount) || 0;
        const amountB = Number(b.amount) || 0;

        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        if (sortBy === 'highest') return amountB - amountA;
        if (sortBy === 'lowest') return amountA - amountB;
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="card bg-dark text-white border-secondary p-3 shadow-sm h-100">
      {/* Controls Header */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-secondary text-muted">
              <FaMagnifyingGlass size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-secondary text-white border-secondary shadow-none"
              placeholder="Search descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-secondary border-secondary text-muted"
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <FaXmark size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select bg-secondary text-white border-secondary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {Array.isArray(categories) &&
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            <option value="OTHERS">Others</option>
          </select>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select bg-secondary text-white border-secondary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Scrollable Data Table Container */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          Loading transactions...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-5 text-muted border border-secondary rounded">
          No transactions match your search criteria.
        </div>
      ) : (
        <div
          className="table-responsive"
          style={{ maxHeight: '420px', overflowY: 'auto' }}
        >
          <table className="table table-dark table-hover align-middle mb-0">
            <thead className="sticky-top bg-dark" style={{ zIndex: 1 }}>
              <tr className="text-muted text-uppercase small border-secondary">
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-end">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => {
                const category = Array.isArray(categories)
                  ? categories.find((c) => c.id === t.categoryId)
                  : null;

                return (
                  <tr key={t.id} className="border-secondary">
                    <td className="fw-semibold">{t.description || 'Untitled Transaction'}</td>
                    <td>
                      <span
                        className="badge rounded-pill text-dark"
                        style={{ backgroundColor: category?.color || '#6c757d' }}
                      >
                        {category?.name || (t.categoryId === 'OTHERS' ? 'Others' : 'General')}
                      </span>
                    </td>
                    <td className="text-muted small">{formatDate(t.date)}</td>
                    <td
                      className={`text-end fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₹
                      {Number(t.amount || 0).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onEdit && onEdit(t)}
                        className="btn btn-sm text-info p-1 me-1"
                        title="Edit"
                      >
                        <FaPenToSquare size={16} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(t.id)}
                        className="btn btn-sm text-danger p-1"
                        title="Delete"
                      >
                        <FaTrashCan size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}