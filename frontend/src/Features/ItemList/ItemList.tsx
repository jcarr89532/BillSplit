import React from 'react';
import './ItemList.css';
import type { ItemizedBill } from './models/ItemizedBill';

interface ItemListProps {
  receipt: ItemizedBill;
  onBack: () => void;
  onSave: (bill: ItemizedBill) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ receipt, onBack, onSave }) => {
  return (
    <div>
      <h1>Item List</h1>
      <p>{receipt.title}</p>
      <p>{receipt.items.map((item) => item.name).join(', ')}</p>
      <p>{receipt.tax}</p>
      <p>{receipt.subtotal}</p>
      <p>{receipt.total}</p>
      <button onClick={() => onSave(receipt)}>Save</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};
