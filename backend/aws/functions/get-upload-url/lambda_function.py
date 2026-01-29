import json
from http import HTTPStatus
from dataclasses import asdict

from DTO.presign_request_dto import PresignRequest
from DTO.http_response import HttpResponse
from presign_service import PresignService
from config import AppConfig

from daily_quota import enforce_daily_limit

service = PresignService()


def lambda_handler(event, _):
    try:
        if not enforce_daily_limit():
            return HttpResponse(
                statusCode=HTTPStatus.TOO_MANY_REQUESTS,
                body={"error": "Daily request limit reached"},
            ).to_dict()

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
