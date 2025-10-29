import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class AppConfig:
    region: str = os.getenv("AWS_REGION", "us-west-2")
    # Optional S3/Textract endpoint overrides (e.g., for LocalStack)
    s3_endpoint_url: Optional[str] = os.getenv("S3_ENDPOINT_URL")
    textract_endpoint_url: Optional[str] = os.getenv("TEXTRACT_ENDPOINT_URL")
    aws_access_key_id: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
