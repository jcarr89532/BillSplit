import React, { useState } from 'react';
import './ItemTable.css';
import type { Item } from '../../models/Item';
import { ItemEditForm } from '../ItemEditForm/ItemEditForm';

interface ItemTableProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({ items, onItemsChange }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleRowClick = (item: Item) => {
    setEditingItem(item);
  };

  const handleSave = (updatedItem: Item) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    onItemsChange(updatedItems);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!editingItem) return;
    const updatedItems = items.filter(item => item.id !== editingItem.id);
    onItemsChange(updatedItems);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  if (editingItem) {
    return (
      <ItemEditForm
        item={editingItem}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="item-table-wrapper">
      <table className="item-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="item-table-row"
              onClick={() => handleRowClick(item)}
            >
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>${item.unit_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
