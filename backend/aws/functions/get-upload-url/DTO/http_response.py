import json
from dataclasses import dataclass
from typing import Optional, Dict

@dataclass
class HttpResponse:
    statusCode: int
    body: Dict
    headers: Optional[Dict] = None

    def to_dict(self):
        return {
            "statusCode": self.statusCode,
            "headers": self.headers or {"Content-Type": "application/json"},
            "body": json.dumps(self.body),
        }