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

    def parse_currency(self, value: str) -> float:
        """
        Parse a currency string to a float value.
        Removes $ and commas, handles errors gracefully.
        """
        if not value:
            return 0.0
        try:
            return float(value.replace("$", "").replace(",", "").strip())
        except (ValueError, AttributeError):
            return 0.0
    
    def parse_float(self, value: str, default: float = 0.0) -> float:
        """
        Parse a string to a float value with a default fallback.
        """
        if not value:
            return default
        try:
            return float(value.strip())
        except (ValueError, AttributeError):
            return default
    
    def extract_field_info(self, field: dict) -> tuple[str, str]:
        """
        Extract field type and value from a Textract field.
        Returns (field_type, field_value) as uppercase type and text value.
        """
        field_type = field.get("Type", {}).get("Text", "").upper()
        field_value = field.get("ValueDetection", {}).get("Text", "")
        return field_type, field_value
    
    def extract_summary_fields(self, expense_data: dict) -> dict:
        """
        Extract summary fields (title, tax, subtotal, total, tip) from expense data.
        Returns a dictionary with the extracted values.
        """
        expense_documents = expense_data.get("ExpenseDocuments", [])
        
        title = "Receipt"
        tax = 0.0
        subtotal = 0.0
        total = 0.0
        tip = 0.0
        
        if expense_documents:
            summary_fields_list = expense_documents[0].get("SummaryFields", [])
            for field in summary_fields_list:
                field_type, field_value = self.extract_field_info(field)
                
                if field_type in ["VENDOR_NAME", "RECEIPT_NUMBER", "MERCHANT_NAME"] and field_value:
                    title = field_value
                elif field_type == "TAX" and field_value:
                    tax = self.parse_currency(field_value)
                elif field_type == "SUBTOTAL" and field_value:
                    subtotal = self.parse_currency(field_value)
                elif field_type == "TOTAL" and field_value:
                    total = self.parse_currency(field_value)
                elif field_type == "TIP" and field_value:
                    tip = self.parse_currency(field_value)
        
        return {
            "title": title,
            "tax": tax,
            "subtotal": subtotal,
            "total": total,
            "tip": tip
        }
    
    def extract_line_items(self, expense_data: dict) -> list[Item]:
        """
        Extract line items from expense data.
        Returns a list of Item objects.
        """
        expense_documents = expense_data.get("ExpenseDocuments", [])
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
                        field_type, field_value = self.extract_field_info(field)
                        
                        if field_type == "ITEM":
                            item_name = field_value
                        elif field_type == "PRICE":
                            item_price = self.parse_currency(field_value)
                        elif field_type == "QUANTITY":
                            item_qty = self.parse_float(field_value, default=1.0)
                    
                    if item_name:
                        items.append(Item(
                            id=str(uuid.uuid4()),
                            name=item_name,
                            unit_price=item_price,
                            qty=item_qty
                        ))
        
        return items
    
    def format_to_itemized_bill(self, expense_data: dict) -> OcrResponse:
        """
        Format raw Textract expense data into ItemizedBill structure.
        """
        summary_fields = self.extract_summary_fields(expense_data)
        items = self.extract_line_items(expense_data)
        
        return OcrResponse(
            title=summary_fields["title"],
            items=items,
            tax=summary_fields["tax"],
            subtotal=summary_fields["subtotal"],
            total=summary_fields["total"],
            tip=summary_fields["tip"]
        )

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
