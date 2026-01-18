import json
from http import HTTPStatus
from DTO.presign_request_dto import PresignRequest
from DTO.http_response import HttpResponse
from presign_service import PresignService
from config import AppConfig
from dataclasses import asdict

service = PresignService()

def handler(event, _):
    try:
        qs = event.get("queryStringParameters") or {}
        req = PresignRequest(
            filename=qs.get("filename", "upload.bin"),
            prefix=qs.get("prefix", "receipts"),
            expires=int(qs.get("expires", 300)),
        )

        res = service.presign_put(req)
        return HttpResponse(statusCode=HTTPStatus.OK, body=asdict(res)).to_dict()

    except Exception as e:
        return HttpResponse(
            statusCode=HTTPStatus.INTERNAL_SERVER_ERROR,
            body={"error": str(e)},
        ).to_dict()