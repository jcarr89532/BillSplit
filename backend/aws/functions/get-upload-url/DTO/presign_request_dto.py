from dataclasses import dataclass

@dataclass
class PresignRequest:
    filename: str
    prefix: str = "receipts"
    expires: int = 300