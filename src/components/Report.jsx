import React, { useState, useMemo } from 'react';
import { FaArrowLeft, FaFilePdf, FaChartColumn, FaCalendarDays } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const parts = String(dateString).split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.slice(-2)}`;
    }
    return dateString;
};

export default function Reports({ transactions = [], categories = [], onBack }) {
    const [viewType, setViewType] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // Filter transactions based on selected month/year with safety checks
    const filteredData = useMemo(() => {
        if (!Array.isArray(transactions)) return [];
        return transactions.filter((t) => {
            if (!t || !t.date) return false;
            const date = new Date(t.date);
            if (isNaN(date.getTime())) return false; // Ignore invalid dates

            if (viewType === 'yearly') {
                return date.getFullYear() === selectedYear;
            }
            return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
        });
    }, [transactions, viewType, selectedYear, selectedMonth]);

    // Calculate Summary Metrics
    const summary = useMemo(() => {
        const income = filteredData
            .filter((t) => t.type === 'income')
            .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
        const expense = filteredData
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
        return { income, expense, net: income - expense };
    }, [filteredData]);

    // Data for Yearly Bar Chart (12 Months Breakdown)
    const chartData = useMemo(() => {
        if (viewType === 'monthly' || !Array.isArray(transactions)) return [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => {
            const monthTx = transactions.filter((t) => {
                if (!t || !t.date) return false;
                const d = new Date(t.date);
                return !isNaN(d.getTime()) && d.getFullYear() === selectedYear && d.getMonth() === index;
            });
            const inc = monthTx.filter((t) => t.type === 'income').reduce((a, b) => a + (Number(b.amount) || 0), 0);
            const exp = monthTx.filter((t) => t.type === 'expense').reduce((a, b) => a + (Number(b.amount) || 0), 0);
            return { name: month, Income: inc, Expense: exp };
        });
    }, [transactions, viewType, selectedYear]);

    // Export PDF Function
    const exportPDF = () => {
        try {
            const doc = new jsPDF();
            const period = viewType === 'yearly' ? `${selectedYear}` : `${selectedMonth + 1}/${selectedYear}`;

            doc.setFontSize(18);
            doc.text(`Financial Report - ${period}`, 14, 22);

            doc.setFontSize(11);
            doc.text(
                `Total Income: Rs. ${summary.income.toFixed(2)} | Total Expense: Rs. ${summary.expense.toFixed(2)} | Net: Rs. ${summary.net.toFixed(2)}`,
                14,
                30
            );

            const tableData = filteredData.map((t) => {
                const categoryObj = Array.isArray(categories) ? categories.find((c) => c.id === t.categoryId) : null;
                return [
                    formatDate(t.date),
                    t.description || 'N/A',
                    categoryObj ? categoryObj.name : 'General',
                    t.type ? t.type.toUpperCase() : 'N/A',
                    `Rs. ${Number(t.amount || 0).toFixed(2)}`
                ];
            });

            autoTable(doc, {
                startY: 40,
                head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
                body: tableData.length > 0 ? tableData : [['-', 'No transactions recorded', '-', '-', '-']],
                theme: 'grid',
                headStyles: { fillColor: [25, 135, 84] } // Bootstrap Success Green
            });

            doc.save(`Expense_Report_${period.replace('/', '-')}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate PDF report.');
        }
    };

    return (
        <div className="container py-4" data-bs-theme="dark">

            {/* Header Bar */}
            <div className="d-flex justify-content-between align-items-center bg-dark p-4 rounded-3 border border-secondary mb-4 shadow-sm">
                <div className="d-flex align-items-center gap-3">
                    <button onClick={onBack} className="btn btn-outline-secondary btn-sm" title="Back to Dashboard">
                        <FaArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="fw-bold text-info m-0 d-flex align-items-center gap-2">
                            <FaChartColumn /> Analytics & Reports
                        </h2>
                    </div>
                </div>
                <button onClick={exportPDF} className="btn btn-danger fw-bold d-flex align-items-center gap-2">
                    <FaFilePdf size={18} /> Export PDF
                </button>
            </div>

            {/* Filter Selection Controls */}
            <div className="card bg-dark border-secondary mb-4 p-3 shadow-sm">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <FaCalendarDays size={20} className="text-secondary" />
                        <span className="fw-semibold text-muted">View Period:</span>
                    </div>

                    <select
                        className="form-select w-auto bg-body-tertiary text-white border-secondary"
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                    >
                        <option value="monthly">Monthly View</option>
                        <option value="yearly">Yearly View</option>
                    </select>

                    <select
                        className="form-select w-auto bg-body-tertiary text-white border-secondary"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {[2024, 2025, 2026, 2027].map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    {viewType === 'monthly' && (
                        <select
                            className="form-select w-auto bg-body-tertiary text-white border-secondary"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            {[
                                'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'
                            ].map((m, i) => (
                                <option key={m} value={i}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card bg-dark border-success text-center p-4 shadow-sm h-100">
                        <h5 className="text-success fw-bold mb-2">Total Income</h5>
                        <h2 className="fw-bold m-0 text-white">₹{summary.income.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card bg-dark border-danger text-center p-4 shadow-sm h-100">
                        <h5 className="text-danger fw-bold mb-2">Total Expense</h5>
                        <h2 className="fw-bold m-0 text-white">₹{summary.expense.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card bg-dark border-info text-center p-4 shadow-sm h-100">
                        <h5 className="text-info fw-bold mb-2">Net Savings</h5>
                        <h2 className={`fw-bold m-0 ${summary.net >= 0 ? 'text-info' : 'text-danger'}`}>
                            ₹{summary.net.toFixed(2)}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Recharts Bar Chart (Visible in Yearly View) */}
            {viewType === 'yearly' && (
                <div className="card bg-dark border-secondary p-4 shadow-sm mb-4" style={{ height: '420px' }}>
                    <h5 className="fw-bold mb-4 text-white">Monthly Comparison ({selectedYear})</h5>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#aaa" />
                            <YAxis stroke="#aaa" tickFormatter={(val) => `₹${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#444', borderRadius: '8px' }}
                                formatter={(val) => [`₹${Number(val).toFixed(2)}`, '']}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="Income" fill="#198754" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expense" fill="#dc3545" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Itemized Transactions Table with Scrollbar */}
            <div className="card bg-dark border-secondary p-4 shadow-sm">
                <h5 className="fw-bold mb-3 text-white">
                    Itemized Transactions ({filteredData.length})
                </h5>

                {filteredData.length === 0 ? (
                    <div className="text-center py-5 text-muted border border-secondary rounded">
                        No transaction history found for this period.
                    </div>
                ) : (
                    <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead className="sticky-top bg-dark" style={{ zIndex: 1 }}>
                                <tr className="text-muted text-uppercase small border-secondary">
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((t) => {
                                    const categoryObj = Array.isArray(categories) ? categories.find((c) => c.id === t.categoryId) : null;
                                    return (
                                        <tr key={t.id} className="border-secondary">
                                            <td className="text-muted small">{formatDate(t.date)}</td>
                                            <td className="fw-semibold">{t.description || 'N/A'}</td>
                                            <td>
                                                <span
                                                    className="badge rounded-pill text-dark"
                                                    style={{ backgroundColor: categoryObj?.color || '#6c757d' }}
                                                >
                                                    {categoryObj?.name || 'General'}
                                                </span>
                                            </td><td>
                                                <span
                                                    className="badge rounded-pill text-dark"
                                                    style={{ backgroundColor: categoryObj?.color || '#6c757d' }}
                                                >
                                                    {categoryObj?.name || (t.categoryId === 'OTHERS' ? 'Others' : 'General')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${t.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                                    {t.type ? t.type.toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                            <td className={`text-end fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                                {t.type === 'income' ? '+' : '-'}₹{Number(t.amount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}