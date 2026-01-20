import json
from http import HTTPStatus
from DTO.ocr_request_dto import OcrRequest
from DTO.http_response import HttpResponse
from ocr_service import OcrService
from dataclasses import asdict

service = OcrService()

#TODO: Function to extract text from a receipt image (this is just boiler plate code so will need to be updated))

def lambda_handler(event, _):
    try:
        body = json.loads(event.get("body") or "{}")
        
        # Validate required fields
        if "bucket" not in body or "key" not in body:
            return HttpResponse(
                statusCode=HTTPStatus.BAD_REQUEST,
                body={"error": "Missing required fields: bucket and key"}
            ).to_dict()
        
        request = OcrRequest(
            bucket=body["bucket"],
            key=body["key"]
        )
        
        response = service.extract_text(request)
        return HttpResponse(
            statusCode=HTTPStatus.OK, 
            body=asdict(response)
        ).to_dict()
        
    except json.JSONDecodeError as e:
        return HttpResponse(
            statusCode=HTTPStatus.BAD_REQUEST,
            body={"error": f"Invalid JSON: {str(e)}"}
        ).to_dict()
    except KeyError as e:
        return HttpResponse(
            statusCode=HTTPStatus.BAD_REQUEST,
            body={"error": f"Missing required field: {str(e)}"}
        ).to_dict()
    except Exception as e:
        return HttpResponse(
            statusCode=HTTPStatus.INTERNAL_SERVER_ERROR,
            body={"error": str(e)}
        ).to_dict()
