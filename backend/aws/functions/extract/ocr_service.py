import boto3
from botocore.exceptions import ClientError
from typing import Optional
from DTO.ocr_request_dto import OcrRequest
from DTO.ocr_response_dto import OcrResponse
from config import AppConfig

class OcrService:
    def __init__(self, config: Optional[AppConfig] = None):
        self.config = config or AppConfig()
        self.textract = boto3.client(
            "textract", 
            region_name=self.config.region,
            endpoint_url=self.config.textract_endpoint_url,
        )
        self.s3 = boto3.client(
            "s3",
            region_name=self.config.region,
        )

    def extract_text(self, request: OcrRequest) -> OcrResponse:
        """
        Extract text from document using AWS Textract and clean up the S3 object.
        """
        try:
            # Extract text using Textract
            response = self.textract.detect_document_text(
                Document={"S3Object": {"Bucket": request.bucket, "Name": request.key}}
            )
            
            # Extract lines from response
            lines = [
                block["Text"] 
                for block in response.get("Blocks", []) 
                if block.get("BlockType") == "LINE"
            ]
            
            # Clean up the S3 object
            self.s3.delete_object(Bucket=request.bucket, Key=request.key)
            
            return OcrResponse(
                lineCount=len(lines),
                text="\n".join(lines)
            )
            
        except ClientError as e:
            raise RuntimeError(f"Textract error: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"OCR processing error: {str(e)}")
