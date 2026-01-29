from datetime import datetime, timezone
import os

import boto3
from botocore.exceptions import ClientError

TABLE = os.getenv("USAGE_TABLE", "ApiUsage")
LIMIT = int(os.getenv("DAILY_LIMIT", "200"))

ddb = boto3.client("dynamodb")


def enforce_daily_limit() -> bool:
    """Returns True if allowed, False if daily limit reached."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    try:
        ddb.update_item(
            TableName=TABLE,
            Key={"date": {"S": today}},
            UpdateExpression="SET #used = if_not_exists(#used, :zero) + :one",
            ConditionExpression="attribute_not_exists(#used) OR #used < :limit",
            ExpressionAttributeNames={"#used": "used"},
            ExpressionAttributeValues={
                ":zero": {"N": "0"},
                ":one": {"N": "1"},
                ":limit": {"N": str(LIMIT)},
            },
        )
        return True
    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            return False
        raise