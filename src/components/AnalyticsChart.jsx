import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

 function AnalyticsChart({ transactions, categories }) {
  const expenseData = categories
    .map((cat) => {
      const total = transactions
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { name: cat.name, value: total, color: cat.color };
    })
    .filter((item) => item.value > 0);

  return (
    <div className="card bg-dark text-white border-secondary p-3 shadow-sm h-100">
      <h5 className="fw-bold mb-3 border-bottom border-secondary pb-2">Expense Breakdown</h5>
      {expenseData.length === 0 ? (
        <div className="text-center py-5 text-muted">No expense data available to display.</div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={4}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => `₹${Number(val).toFixed(2)}`}
                contentStyle={{ backgroundColor: '#212529', borderColor: '#495057', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default  AnalyticsChart