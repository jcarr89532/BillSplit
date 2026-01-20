from dataclasses import dataclass

@dataclass
class PresignResponse:
    url: str
    bucket: str
    key: str
    contentType: str
    expiresIn: int