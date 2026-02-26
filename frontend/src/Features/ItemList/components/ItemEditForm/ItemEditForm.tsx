import React from 'react';
import './ItemEditForm.css';
import type { Item } from '../../models/Item';

interface ItemEditFormProps {
  item: Item;
  onSave: (item: Item) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export const ItemEditForm: React.FC<ItemEditFormProps> = ({ item, onSave, onDelete, onCancel }) => {
  const [editForm, setEditForm] = React.useState<Item>(item);

  const handleSave = () => {
    onSave(editForm);
  };

  return (
    <div className="item-edit-form-modal">
      <div className="item-edit-form">
        <h3>Edit Item</h3>
        <div className="item-edit-form-field">
          <label>Name:</label>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </div>
        <div className="item-edit-form-field">
          <label>Quantity:</label>
          <input
            type="number"
            step="0.01"
            value={editForm.qty}
            onChange={(e) => setEditForm({ ...editForm, qty: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="item-edit-form-field">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={editForm.unit_price}
            onChange={(e) => setEditForm({ ...editForm, unit_price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="item-edit-form-actions">
          <button onClick={handleSave}>Save</button>
          <button className="item-edit-form-delete-btn" onClick={onDelete}>Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
