from dataclasses import dataclass
from typing import List

@dataclass
class Item:
    id: str
    name: str
    unit_price: float
    qty: float

@dataclass
class OcrResponse:
    title: str
    items: List[Item]
    tax: float
    subtotal: float
    total: float
