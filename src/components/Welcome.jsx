import React from 'react';
import { FaWallet, FaArrowRight, FaShieldHalved, FaChartPie, FaChartLine, FaWandMagicSparkles } from 'react-icons/fa6';
export default function Welcome({ onGetStarted }) {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden py-5" data-bs-theme="dark">
      
      {/* Decorative Background Glows */}
      <div 
        className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, #198754 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container text-center position-relative z-1 my-auto">
        
        {/* Top Badge */}
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 rounded-pill bg-body-tertiary border border-secondary shadow-sm">
          <FaWandMagicSparkles size={16} className="text-warning" />
          <span className="small text-muted fw-medium">Smart Personal Finance Manager</span>
        </div>

        {/* Main Title Heading */}
        <h1 className="display-3 fw-black tracking-tight mb-3">
          Expense <span className="text-success">Tracker</span>
        </h1>

        {/* Subheading */}
        <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '650px' }}>
          Take complete control of your personal finances. Track daily expenses, monitor income streams, and analyze spending patterns with real-time visual insights.
        </p>

        {/* Action Button to launch App */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
          <button
            onClick={onGetStarted}
            className="btn btn-success btn-lg fw-bold px-5 py-3 rounded-pill d-inline-flex align-items-center justify-content-center gap-2 shadow-lg"
          >
            Go to Dashboard <FaArrowRight size={20} />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="row g-4 mt-2 justify-content-center text-start">
          <div className="col-12 col-md-4">
            <div className="card bg-body-tertiary border-secondary h-100 p-3 shadow-sm hover-lift">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-success bg-opacity-10 text-success">
                  <FaWallet size={24} />
                </div>
                <h5 className="fw-bold m-0">Live Balance</h5>
              </div>
              <p className="text-muted small m-0">
                Instantly monitor your net balance, total income, and savings rate in real-time.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card bg-body-tertiary border-secondary h-100 p-3 shadow-sm hover-lift">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-info bg-opacity-10 text-info">
                  <FaChartPie size={24} />
                </div>
                <h5 className="fw-bold m-0">Visual Charts</h5>
              </div>
              <p className="text-muted small m-0">
                Visualize spending habits across multiple categories with interactive charts.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card bg-body-tertiary border-secondary h-100 p-3 shadow-sm hover-lift">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="p-2 rounded bg-warning bg-opacity-10 text-warning">
                 <FaChartLine size={24} />
                </div>
                <h5 className="fw-bold m-0">Smart Filters</h5>
              </div>
              <p className="text-muted small m-0">
                Filter and sort transactions by category, amount, or date with lightning speed.
              </p>
            </div>
          </div>
        </div>

      </div>

      
      

    </div>
  );
}