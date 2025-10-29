from dataclasses import dataclass

@dataclass
class OcrResponse:
    lineCount: int
    text: str
