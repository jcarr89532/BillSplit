import type { Item } from '../models/Item';
import type { ItemizedBill } from '../models/ItemizedBill';

interface BillComparison {
  title: string;
  tax: number;
  tip: number;
  items: Item[];
}

export class ItemService {
  /**
   * Calculate the subtotal from a list of items.
   * Assumes unit_price is per-unit, so multiplies by quantity.
   */
  static calculateSubtotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0);
  }

  /**
   * Calculate the total including tax and tip.
   */
  static calculateTotal(items: Item[], tax: number, tip: number): number {
    return ItemService.calculateSubtotal(items) + tax + tip;
  }

  /**
   * Check if two item arrays are equal by comparing all item properties.
   */
  private static itemsEqual(items1: Item[], items2: Item[]): boolean {
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
  }

  /**
   * Check if two bills are equal by comparing title, tax, tip, and items.
   */
  static billEqual(bill1: BillComparison, bill2: BillComparison): boolean {
    return (
      bill1.title === bill2.title &&
      bill1.tax === bill2.tax &&
      bill1.tip === bill2.tip &&
      ItemService.itemsEqual(bill1.items, bill2.items)
    );
  }

  /**
   * Check if two values match within a tolerance (for floating point comparison).
   */
  private static valuesMatch(value1: number, value2: number, tolerance: number = 0.01): boolean {
    return Math.abs(value1 - value2) <= tolerance;
  }

  /**
   * Fill in missing tax or tip if total is greater than calculated total.
   * Returns updated tax and tip values.
   */
  private static fillMissingTaxOrTip(
    tax: number,
    tip: number,
    calculatedTotal: number,
    actualTotal: number,
    tolerance: number
  ): { tax: number; tip: number } {
    if (actualTotal <= calculatedTotal) {
      return { tax, tip };
    }

    const difference = actualTotal - calculatedTotal;
    const isTaxEmpty = tax === 0 || tax < tolerance;
    const isTipEmpty = tip === 0 || tip < tolerance;

    if (isTaxEmpty) {
      return { tax: difference, tip };
    } else if (isTipEmpty) {
      return { tax, tip: difference };
    }

    return { tax, tip };
  }

  /**
   * Calculate subtotal treating unit_price as total for that quantity (no multiplication).
   */
  private static calculateSubtotalAsTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.unit_price, 0);
  }

  /**
   * Check if the total matches assuming unit_price is total for that quantity.
   */
  private static checkIfTotalMatchesWithTotalPricing(
    items: Item[],
    tax: number,
    tip: number,
    expectedTotal: number,
    tolerance: number
  ): boolean {
    const subtotal = ItemService.calculateSubtotalAsTotal(items);
    const calculatedTotal = subtotal + tax + tip;
    return ItemService.valuesMatch(expectedTotal, calculatedTotal, tolerance);
  }

  /**
   * Check if the total matches assuming unit_price is per-unit.
   */
  private static checkIfTotalMatchesWithPerUnitPricing(
    items: Item[],
    tax: number,
    tip: number,
    expectedTotal: number,
    tolerance: number
  ): boolean {
    const subtotal = ItemService.calculateSubtotal(items);
    const calculatedTotal = subtotal + tax + tip;
    return ItemService.valuesMatch(expectedTotal, calculatedTotal, tolerance);
  }

  /**
   * Convert items from total pricing to per-unit pricing.
   */
  private static convertItemsToPerUnit(items: Item[]): Item[] {
    return items.map(item => ({
      ...item,
      unit_price: item.qty > 0 ? item.unit_price / item.qty : item.unit_price
    }));
  }

  /**
   * Update the subtotal in the bill based on current items.
   */
  private static updateBillSubtotal(bill: ItemizedBill): void {
    bill.subtotal = ItemService.calculateSubtotal(bill.items);
  }

  /**
   * Validate and correct bill data before display.
   * By default assumes unit_price is total for that quantity.
   * 1. If total doesn't match, try treating unit_price as per-unit (multiply by quantity)
   * 2. If total is more than calculated and tax/tip are missing, fill them in
   */
  static validateAndCorrectBill(bill: ItemizedBill): ItemizedBill {
    const correctedBill = { ...bill };
    const tolerance = 0.01;

    // Check if total matches with default assumption (total pricing)
    const matchesTotalPricing = ItemService.checkIfTotalMatchesWithTotalPricing(
      correctedBill.items,
      correctedBill.tax,
      correctedBill.tip,
      correctedBill.total,
      tolerance
    );

    if (matchesTotalPricing) {
      // Default assumption was correct, convert items to per-unit for consistency
      correctedBill.items = ItemService.convertItemsToPerUnit(correctedBill.items);
      ItemService.updateBillSubtotal(correctedBill);
      return correctedBill;
    }

    // Check if total matches with per-unit pricing
    const matchesPerUnitPricing = ItemService.checkIfTotalMatchesWithPerUnitPricing(
      correctedBill.items,
      correctedBill.tax,
      correctedBill.tip,
      correctedBill.total,
      tolerance
    );

    if (matchesPerUnitPricing) {
      // Items are already per-unit, no conversion needed
      ItemService.updateBillSubtotal(correctedBill);
      return correctedBill;
    }

    // Try filling in missing tax or tip
    const defaultSubtotal = ItemService.calculateSubtotalAsTotal(correctedBill.items);
    const defaultTotal = defaultSubtotal + correctedBill.tax + correctedBill.tip;
    const { tax, tip } = ItemService.fillMissingTaxOrTip(
      correctedBill.tax,
      correctedBill.tip,
      defaultTotal,
      correctedBill.total,
      tolerance
    );
    correctedBill.tax = tax;
    correctedBill.tip = tip;

    // Recheck if total matches with updated tax/tip
    const matchesAfterTaxTipUpdate = ItemService.checkIfTotalMatchesWithTotalPricing(
      correctedBill.items,
      tax,
      tip,
      correctedBill.total,
      tolerance
    );

    if (matchesAfterTaxTipUpdate) {
      // Default assumption was correct, convert items to per-unit
      correctedBill.items = ItemService.convertItemsToPerUnit(correctedBill.items);
      ItemService.updateBillSubtotal(correctedBill);
      return correctedBill;
    }

    // Final update: convert to per-unit for consistency
    correctedBill.items = ItemService.convertItemsToPerUnit(correctedBill.items);
    ItemService.updateBillSubtotal(correctedBill);
    return correctedBill;
  }
}
