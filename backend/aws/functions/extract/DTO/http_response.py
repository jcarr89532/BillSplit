import json
from dataclasses import dataclass
from typing import Optional, Dict

@dataclass
class HttpResponse:
    statusCode: int
    body: Dict
    headers: Optional[Dict] = None

    def to_dict(self):
        default_headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
        return {
            "statusCode": self.statusCode,
            "headers": self.headers or default_headers,
            "body": json.dumps(self.body),
        }
