import React from 'react';
import './ItemList.css';

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ItemListProps {
  receipt: string;
  onBack: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({ receipt }) => {
  return (
    <div>
      <h1>Item List</h1>
      <p>{receipt}</p>
    </div>
  );
};
