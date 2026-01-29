from typing import Optional
import uuid, mimetypes, boto3
from DTO.presign_request_dto import PresignRequest
from DTO.presign_response_dto import PresignResponse
from config import AppConfig

class PresignService:
    def __init__(self, config: Optional[AppConfig] = None):
        self.config = config or AppConfig()
        self.s3 = boto3.client(
            "s3", 
            region_name=self.config.region,
        )

    def presign_put(self, req: PresignRequest) -> PresignResponse:
        # clamp expires: 60s–3600s
        exp = max(60, min(int(req.expires), 3600))

        # normalize prefix and extension
        prefix = (req.prefix or "").strip("/")

        ext = ""
        if "." in req.filename:
            # preserve last extension only
            ext = "." + req.filename.rsplit(".", 1)[1].lower()

        key = f"{prefix}/{uuid.uuid4()}{ext}" if prefix else f"{uuid.uuid4()}{ext}"
        content_type = mimetypes.guess_type(req.filename)[0] or "application/octet-stream"

        url = self.s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.config.bucket, "Key": key},
            ExpiresIn=exp,
        )

        return PresignResponse(
            url=url,
            bucket=self.config.bucket,
            key=key,
            contentType=content_type,
            expiresIn=exp,
        )