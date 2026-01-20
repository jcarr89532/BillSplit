from dataclasses import dataclass

@dataclass
class OcrRequest:
    bucket: str
    key: str
