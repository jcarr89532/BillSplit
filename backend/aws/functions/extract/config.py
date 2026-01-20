import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class AppConfig:
    region: str = os.getenv("AWS_REGION", "us-west-2")
    # Optional Textract endpoint overrides (e.g., for LocalStack)
    textract_endpoint_url: Optional[str] = os.getenv("TEXTRACT_ENDPOINT_URL")
