import React from 'react';
import type { ReceiptItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

interface EditableTableProps {
  items: ReceiptItem[];
  onItemsChange: (items: ReceiptItem[]) => void;
  className?: string;
}

export const EditableTable: React.FC<EditableTableProps> = ({
  items,
  onItemsChange,
  className = ''
}) => {
  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    const updatedItems = items.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    );
    onItemsChange(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onItemsChange(updatedItems);
  };

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      quantity: 1,
      claimedBy: []
    };
    onItemsChange([...items, newItem]);
  };

  const calculateItemTotal = (item: ReceiptItem) => {
    return item.price * item.quantity;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-light text-gray-100">Receipt Items</h3>
        <Button 
          onClick={addItem} 
          size="sm" 
          className="bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl font-medium transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-700 rounded-xl p-6 bg-gray-800 hover:bg-gray-700 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Item name"
                  className="border-0 p-0 h-auto text-lg font-medium bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-3 rounded-full p-2 transition-all duration-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-gray-100 focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-gray-100 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Total</span>
                <span className="font-bold text-xl text-gray-100">${calculateItemTotal(item).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-50">
              <TableHead className="w-[40%] text-gray-700 font-semibold">Item Name</TableHead>
              <TableHead className="w-[20%] text-gray-700 font-semibold">Price</TableHead>
              <TableHead className="w-[20%] text-gray-700 font-semibold">Quantity</TableHead>
              <TableHead className="w-[20%] text-gray-700 font-semibold">Total</TableHead>
              <TableHead className="w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <TableCell className="py-4">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Item name"
                    className="border-0 p-0 h-auto bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none w-full"
                  />
                </TableCell>
                <TableCell className="py-4">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="border-0 p-0 h-auto bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none w-full"
                  />
                </TableCell>
                <TableCell className="py-4">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className="border-0 p-0 h-auto w-16 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </TableCell>
                <TableCell className="font-semibold text-gray-900 py-4">
                  ${calculateItemTotal(item).toFixed(2)}
                </TableCell>
                <TableCell className="py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-2 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length > 0 && (
        <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300 text-lg">Subtotal:</span>
            <span className="font-bold text-gray-100 text-2xl">${calculateSubtotal().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
