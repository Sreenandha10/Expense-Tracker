import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaArrowLeft, FaChartColumn } from 'react-icons/fa6';
import Welcome from './components/Welcome';
import SummaryCards from './components/SummaryCards';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import AnalyticsChart from './components/AnalyticsChart';
import Reports from './components/Report';

const API_URL = 'https://expense-tracker-backend-3-ad6q.onrender.com';

 function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          fetch(`${API_URL}/transactions`),
          fetch(`${API_URL}/categories`)
        ]);
        setTransactions(await transRes.json());
        setCategories(await catRes.json());
      } catch (err) {
        console.error('Failed fetching data from server:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? (((income - expense) / income) * 100).toFixed(1) : '0.0'
    };
  }, [transactions]);

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData, id) => {
    const payload = { ...formData, amount: parseFloat(formData.amount) };
    try {
      if (id) {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        const res = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        setTransactions((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed saving transaction:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Failed deleting transaction:', err);
    }
  };

  if (currentPage === 'welcome') {
    return <Welcome onGetStarted={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'reports') {
    return (
        <Reports
            transactions={transactions}
            categories={categories}
            onBack={() => setCurrentPage('dashboard')}
        />
    );
}

  return (
    <div className="bg-body-tertiary min-vh-100 py-4" data-bs-theme="dark">
      <div className="container">

        <div className="d-flex justify-content-between align-items-center bg-dark p-4 rounded-3 border border-secondary mb-4 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setCurrentPage('welcome')}
              className="btn btn-outline-secondary btn-sm"
              title="Back to Welcome Page"
            >
              <FaArrowLeft size={18} />
            </button>
            <div>
              <h2 className="fw-bold text-success m-0">Expense Tracker</h2>
              <small className="text-muted">Dashboard Overview</small>
            </div>
          </div>
          <div className='d-flex gap-2'>
            <button
            onClick={() => setCurrentPage('reports')}
            className="btn btn-outline-info fw-bold d-flex align-items-center gap-2"
          >
            <FaChartColumn size={18} /> Reports
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-success fw-bold d-flex align-items-center gap-2">
            <FaPlus size={18} /> Add Transaction
          </button>
          </div>
        </div>

        <SummaryCards metrics={metrics} />

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <TransactionList
              transactions={transactions}
              categories={categories}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
          <div className="col-12 col-lg-4">
            <AnalyticsChart transactions={transactions} categories={categories} />
          </div>
        </div>

        <TransactionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          categories={categories}
          editingTransaction={editingTransaction}
        />

      </div>
    </div>
  );
}

export default App