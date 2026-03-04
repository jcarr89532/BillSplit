import React, { useState, useEffect, useMemo } from 'react';
import './ItemList.css';
import type { ItemizedBill } from './models/ItemizedBill';
import type { Item } from './models/Item';
import { ArrowLeftIcon, RotateCcw } from 'lucide-react';
import { ItemTable } from './components/ItemTable/ItemTable';

interface ItemListProps {
  receipt: ItemizedBill;
  onBack: () => void;
  onSave: (bill: ItemizedBill) => void;
  hasId?: boolean;
}

export const ItemList: React.FC<ItemListProps> = ({ receipt, onBack, onSave, hasId = false }) => {
  const [title, setTitle] = useState(receipt.title);
  const [tax, setTax] = useState(receipt.tax);
  const [tip, setTip] = useState(receipt.tip || 0);
  const [items, setItems] = useState<Item[]>(receipt.items);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingTax, setIsEditingTax] = useState(false);
  const [isEditingTip, setIsEditingTip] = useState(false);

  const originalBill = useMemo(() => ({
    title: receipt.title,
    tax: receipt.tax,
    tip: receipt.tip || 0,
    items: JSON.parse(JSON.stringify(receipt.items)) as Item[],
  }), [receipt]);

  useEffect(() => {
    setTitle(receipt.title);
    setTax(receipt.tax);
    setTip(receipt.tip || 0);
    setItems(receipt.items);
  }, [receipt]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleTaxBlur = () => {
    setIsEditingTax(false);
    const taxValue = parseFloat(tax.toString()) || 0;
    setTax(taxValue);
  };

  const handleTaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTax(false);
      const taxValue = parseFloat(tax.toString()) || 0;
      setTax(taxValue);
    }
  };

  const handleTipBlur = () => {
    setIsEditingTip(false);
    const tipValue = parseFloat(tip.toString()) || 0;
    setTip(tipValue);
  };

  const handleTipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTip(false);
      const tipValue = parseFloat(tip.toString()) || 0;
      setTip(tipValue);
    }
  };

  const handleItemsChange = (updatedItems: Item[]) => {
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + tax + tip;
  };

  const itemsEqual = (items1: Item[], items2: Item[]): boolean => {
    if (items1.length !== items2.length) return false;
    return items1.every((item1, index) => {
      const item2 = items2[index];
      return (
        item1.id === item2.id &&
        item1.name === item2.name &&
        item1.qty === item2.qty &&
        item1.unit_price === item2.unit_price
      );
    });
  };

  const hasChanges = useMemo(() => {
    return (
      title !== originalBill.title ||
      tax !== originalBill.tax ||
      tip !== originalBill.tip ||
      !itemsEqual(items, originalBill.items)
    );
  }, [title, tax, tip, items, originalBill]);

  const isSaveEnabled = !hasId || hasChanges;

  const handleReset = () => {
    setTitle(originalBill.title);
    setTax(originalBill.tax);
    setTip(originalBill.tip);
    setItems(JSON.parse(JSON.stringify(originalBill.items))); // Deep copy
    setIsEditingTitle(false);
    setIsEditingTax(false);
    setIsEditingTip(false);
  };

  const handleSave = () => {
    const updatedBill: ItemizedBill = {
      title,
      items,
      tax,
      tip,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
    };
    onSave(updatedBill);
  };

  return (
    <div className="item-list-container">
      <div className="item-list-wrapper">
        <button className="item-list-back-button" onClick={onBack}>
          <ArrowLeftIcon className="item-list-back-button-icon" />
        </button>
        <div className="item-list-card">
          {isEditingTitle ? (
            <input
              className="item-list-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
            />
          ) : (
            <h1 className="item-list-title" onClick={() => setIsEditingTitle(true)}>{title}</h1>
          )}
          <ItemTable items={items} onItemsChange={handleItemsChange} />
          <div className="item-list-summary">
            {isEditingTax ? (
              <p className="item-list-tax-editing">
                Tax: $
                <input
                  className="item-list-tax-input"
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  onBlur={handleTaxBlur}
                  onKeyDown={handleTaxKeyDown}
                  autoFocus
                />
              </p>
            ) : (
              <p onClick={() => setIsEditingTax(true)}>Tax: ${tax.toFixed(2)}</p>
            )}
            {isEditingTip ? (
              <p className="item-list-tax-editing">
                Tip: $
                <input
                  className="item-list-tax-input"
                  type="number"
                  step="0.01"
                  value={tip}
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                  onBlur={handleTipBlur}
                  onKeyDown={handleTipKeyDown}
                  autoFocus
                />
              </p>
            ) : (
              <p onClick={() => setIsEditingTip(true)}>Tip: ${tip.toFixed(2)}</p>
            )}
            <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
            <p>Total: ${calculateTotal().toFixed(2)}</p>
          </div>
          <div className="item-list-actions">
            <button 
              className="item-list-reset-button" 
              onClick={handleReset}
              disabled={!hasId || !hasChanges}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button 
              className="item-list-save-button" 
              onClick={handleSave}
              disabled={!isSaveEnabled}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
