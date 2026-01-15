import React from 'react';
import './ItemList.css';

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ItemListProps {
  receipt: {
    id: string;
    imageUrl: string;
    items: Item[];
    tax: number;
    tip: number;
    total: number;
  };
  onBack: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({ receipt, onBack }) => {
  return (
    <div className="item-list-container">
      <div className="item-list-wrapper">
        <button onClick={onBack} className="item-list-back-button">
          ← Back
        </button>
        
        <div className="item-list-image-wrapper">
          <img src={receipt.imageUrl} alt="Receipt" className="item-list-image" />
        </div>

        <div className="item-list-card">
          <h2 className="item-list-title">Items</h2>
          <div className="item-list-items">
            {receipt.items.map((item) => (
              <div key={item.id} className="item-list-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="item-list-summary">
            <div className="item-list-summary-row">
              <span>Tax</span>
              <span>${receipt.tax.toFixed(2)}</span>
            </div>
            <div className="item-list-summary-row">
              <span>Tip</span>
              <span>${receipt.tip.toFixed(2)}</span>
            </div>
            <div className="item-list-total">
              <span>Total</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
