import boto3
import uuid
from botocore.exceptions import ClientError
from typing import Optional
from DTO.ocr_request_dto import OcrRequest
from DTO.ocr_response_dto import OcrResponse, Item
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

    def extract_expense_data(self, bucket: str, key: str) -> dict:
        """
        Extract raw expense data from receipt using AWS Textract analyze_expense.
        Returns the raw Textract response.
        """
        try:
            response = self.textract.analyze_expense(
                Document={"S3Object": {"Bucket": bucket, "Name": key}}
            )
            return response
        except ClientError as e:
            raise RuntimeError(f"Textract error: {str(e)}")

    def format_to_itemized_bill(self, expense_data: dict) -> OcrResponse:
        """
        Format raw Textract expense data into ItemizedBill structure.
        """
        expense_documents = expense_data.get("ExpenseDocuments", [])
        
        # Extract title and summary fields (tax, subtotal, total)
        title = "Receipt"
        tax = 0.0
        subtotal = 0.0
        total = 0.0
        
        if expense_documents:
            summary_fields_list = expense_documents[0].get("SummaryFields", [])
            for field in summary_fields_list:
                field_type = field.get("Type", {}).get("Text", "").upper()
                field_value = field.get("ValueDetection", {}).get("Text", "")
                
                if field_type in ["VENDOR_NAME", "RECEIPT_NUMBER", "MERCHANT_NAME"] and field_value:
                    title = field_value
                elif field_type == "TAX" and field_value:
                    try:
                        tax_str = field_value.replace("$", "").replace(",", "").strip()
                        tax = float(tax_str)
                    except (ValueError, AttributeError):
                        tax = 0.0
                elif field_type == "SUBTOTAL" and field_value:
                    try:
                        subtotal_str = field_value.replace("$", "").replace(",", "").strip()
                        subtotal = float(subtotal_str)
                    except (ValueError, AttributeError):
                        subtotal = 0.0
                elif field_type == "TOTAL" and field_value:
                    try:
                        total_str = field_value.replace("$", "").replace(",", "").strip()
                        total = float(total_str)
                    except (ValueError, AttributeError):
                        total = 0.0
        
        # Extract line items
        items = []
        for expense_doc in expense_documents:
            line_item_groups = expense_doc.get("LineItemGroups", [])
            for group in line_item_groups:
                line_items_list = group.get("LineItems", [])
                for item in line_items_list:
                    item_name = ""
                    item_price = 0.0
                    item_qty = 1.0
                    
                    for field in item.get("LineItemExpenseFields", []):
                        field_type = field.get("Type", {}).get("Text", "").upper()
                        field_value = field.get("ValueDetection", {}).get("Text", "")
                        if field_type == "ITEM":
                            item_name = field_value
                        elif field_type == "PRICE":
                            try:
                                price_str = field_value.replace("$", "").replace(",", "").strip()
                                item_price = float(price_str)
                            except (ValueError, AttributeError):
                                item_price = 0.0
                        elif field_type == "QUANTITY":
                            try:
                                item_qty = float(field_value)
                            except (ValueError, AttributeError):
                                item_qty = 1.0
                    
                    if item_name:
                        items.append(Item(
                            id=str(uuid.uuid4()),
                            name=item_name,
                            unit_price=item_price,
                            qty=item_qty
                        ))
        
        return OcrResponse(title=title, items=items, tax=tax, subtotal=subtotal, total=total)

    def extract_text(self, request: OcrRequest) -> OcrResponse:
        """
        Extract expense data from receipt and format it into ItemizedBill structure.
        Also cleans up the S3 object after processing.
        """
        try:
            # Extract raw expense data
            expense_data = self.extract_expense_data(request.bucket, request.key)
            
            # Format into ItemizedBill structure
            response = self.format_to_itemized_bill(expense_data)
            
            # Clean up the S3 object
            self.s3.delete_object(Bucket=request.bucket, Key=request.key)
            
            return response
            
        except Exception as e:
            raise RuntimeError(f"OCR processing error: {str(e)}")
