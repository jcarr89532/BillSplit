import React from 'react';
import './ItemList.css';
import type { ItemizedBill } from './models/ItemizedBill';
import { ArrowLeftIcon } from 'lucide-react';

interface ItemListProps {
  receipt: ItemizedBill;
  onBack: () => void;
  onSave: (bill: ItemizedBill) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ receipt, onBack, onSave }) => {
  return (
    <div className="item-list-container">
      <div className="item-list-wrapper">
        <button className="item-list-back-button" onClick={onBack}>
          <ArrowLeftIcon className="item-list-back-button-icon" />
        </button>
        <div className="item-list-card">
          <h1 className="item-list-title">{receipt.title}</h1>
          <div className="item-list-items">
            {receipt.items.map((item) => (
              <p key={item.id}>{item.name} - ${item.unit_price} - Qty: {item.qty}</p>
            ))}
          </div>
          <div className="item-list-summary">
            <p>Tax: ${receipt.tax}</p>
            <p>Subtotal: ${receipt.subtotal}</p>
            <p>Total: ${receipt.total}</p>
          </div>
          <button className="item-list-save-button" onClick={() => onSave(receipt)}>Save</button>
        </div>
      </div>
    </div>
  );
};
