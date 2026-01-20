import os
from dataclasses import dataclass

@dataclass
class AppConfig:
    region: str = os.getenv("AWS_REGION", "us-west-2")
    bucket: str = os.getenv("BUCKET", "")
    
    def __post_init__(self):
        if not self.bucket:
            raise RuntimeError("Missing BUCKET env var")
