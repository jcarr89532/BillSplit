import React from 'react';
import './HistoryList.css';
import type { BillSummary } from './models/BillSummary';
import { ArrowLeftIcon } from 'lucide-react';

interface HistoryListProps {
  bills: BillSummary[];
  onBack: () => void;
  onBillClick: (bill: BillSummary) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ bills, onBack, onBillClick }) => {
  return (
    <div className="history-list-container">
      <div className="history-list-wrapper">
        <button className="history-list-back-button" onClick={onBack}>
          <ArrowLeftIcon className="history-list-back-button-icon" />
        </button>
        <div className="history-list-card">
          <h1 className="history-list-title">Bill History</h1>
          <div className="history-list-items">
            {bills.length === 0 ? (
              <p className="history-list-empty">No bills found</p>
            ) : (
              bills.map((bill) => (
                <div key={bill.id} className="history-list-item">
                  <span className="history-list-item-title" onClick={() => onBillClick(bill)}>{bill.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
