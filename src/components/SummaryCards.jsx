import React from 'react';
import { FaWallet, FaCircleArrowUp, FaCircleArrowDown, FaChartLine } from 'react-icons/fa6'; 

 function SummaryCards({ metrics }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="fw-semibold small">Net Balance</span>
              <FaWallet className="text-info" size={20} />
            </div>
            <h3 className={`fw-bold m-0 ${metrics.balance >= 0 ? 'text-light' : 'text-danger'}`}>
              ₹{metrics.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="fw-semibold small">Total Income</span>
              <FaCircleArrowUp className="text-success" size={20} />
            </div>
            <h3 className="fw-bold text-success m-0">
              +₹{metrics.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="fw-semibold small">Total Expenses</span>
              <FaCircleArrowDown className="text-danger" size={20} />
            </div>
            <h3 className="fw-bold text-danger m-0">
              -₹{metrics.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center text-muted mb-2">
              <span className="fw-semibold small">Savings Rate</span>
              <FaChartLine className="text-warning" size={20} />
            </div>
            <h3 className="fw-bold text-warning m-0">
              {metrics.savingsRate}%
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards