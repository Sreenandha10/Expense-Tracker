import React, { useState, useEffect } from 'react';

export default function TransactionForm({ isOpen, onClose, onSubmit, categories, editingTransaction }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        categoryId: editingTransaction.categoryId,
        date: editingTransaction.date
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        categoryId: categories[0]?.id || '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingTransaction, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    onSubmit(formData, editingTransaction?.id);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title fw-bold">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small">Description</label>
                <input
                  type="text"
                  required
                  className="form-control bg-secondary text-white border-dark"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Monthly Rent, Client Fee"
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    className="form-control bg-secondary text-white border-dark"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Type</label>
                  <select
                    className="form-select bg-secondary text-white border-dark"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small">Category</label>
                  <select
                    className="form-select bg-secondary text-white border-dark"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Date</label>
                  <input
                    type="date"
                    required
                    className="form-control bg-secondary text-white border-dark"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success fw-bold">
                {editingTransaction ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}