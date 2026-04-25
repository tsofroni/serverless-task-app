import json
import os
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def json_serializer(value):
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)

    return str(value)


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body, default=json_serializer),
    }


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def get_user_id(event):
    request_context = event.get("requestContext", {})
    authorizer = request_context.get("authorizer", {}) or {}
    claims = authorizer.get("claims", {}) or {}

    user_id = claims.get("sub")
    if user_id:
        return user_id

    principal_id = authorizer.get("principalId")
    if principal_id:
        return principal_id

    raise ValueError("No authenticated user found in request context")


def parse_body(event):
    body = event.get("body")

    if not body:
        return {}

    try:
        return json.loads(body)
    except json.JSONDecodeError:
        raise ValueError("Request body is not valid JSON")


def validate_status(status):
    return status in {"OPEN", "IN_PROGRESS", "DONE"}


def validate_priority(priority):
    return priority in {"LOW", "MEDIUM", "HIGH"}


def validate_labels(labels):
    if labels is None:
        return True

    if not isinstance(labels, list):
        return False

    return all(isinstance(label, str) for label in labels)


def validate_string_field(value, field_name, required=False):
    if required and (not value or not isinstance(value, str)):
        return f"{field_name} is required and must be a string"

    if value is not None and not isinstance(value, str):
        return f"{field_name} must be a string"

    return None


def normalize_task_input(data, existing=None):
    existing = existing or {}

    return {
        "title": data.get("title", existing.get("title")),
        "description": data.get("description", existing.get("description", "")),
        "status": data.get("status", existing.get("status", "OPEN")),
        "assignee": data.get("assignee", existing.get("assignee", "")),
        "reporter": data.get("reporter", existing.get("reporter", "Authenticated user")),
        "priority": data.get("priority", existing.get("priority", "MEDIUM")),
        "dueDate": data.get("dueDate", existing.get("dueDate", "")),
        "labels": data.get("labels", existing.get("labels", [])),
    }


def validate_task_fields(task):
    for error in [
        validate_string_field(task["title"], "title", required=True),
        validate_string_field(task["description"], "description"),
        validate_string_field(task["status"], "status", required=True),
        validate_string_field(task["assignee"], "assignee"),
        validate_string_field(task["reporter"], "reporter"),
        validate_string_field(task["priority"], "priority", required=True),
        validate_string_field(task["dueDate"], "dueDate"),
    ]:
        if error:
            return error

    if not validate_status(task["status"]):
        return "status must be one of OPEN, IN_PROGRESS, DONE"

    if not validate_priority(task["priority"]):
        return "priority must be one of LOW, MEDIUM, HIGH"

    if not validate_labels(task["labels"]):
        return "labels must be a list of strings"

    return None


def create_task(user_id, event):
    data = parse_body(event)
    task = normalize_task_input(data)

    error = validate_task_fields(task)
    if error:
        return response(400, {"message": error})

    timestamp = now_iso()
    task_id = str(uuid.uuid4())

    item = {
        "userId": user_id,
        "taskId": task_id,
        **task,
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }

    table.put_item(Item=item)

    return response(201, item)


def list_tasks(user_id):
    result = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )

    return response(200, {"items": result.get("Items", [])})


def get_task(user_id, task_id):
    result = table.get_item(
        Key={
            "userId": user_id,
            "taskId": task_id,
        }
    )

    item = result.get("Item")

    if not item:
        return response(404, {"message": "Task not found"})

    return response(200, item)


def update_task(user_id, task_id, event):
    data = parse_body(event)

    result = table.get_item(
        Key={
            "userId": user_id,
            "taskId": task_id,
        }
    )

    existing = result.get("Item")

    if not existing:
        return response(404, {"message": "Task not found"})

    task = normalize_task_input(data, existing)

    error = validate_task_fields(task)
    if error:
        return response(400, {"message": error})

    updated_item = {
        "userId": user_id,
        "taskId": task_id,
        **task,
        "createdAt": existing["createdAt"],
        "updatedAt": now_iso(),
    }

    table.put_item(Item=updated_item)

    return response(200, updated_item)


def delete_task(user_id, task_id):
    result = table.get_item(
        Key={
            "userId": user_id,
            "taskId": task_id,
        }
    )

    existing = result.get("Item")

    if not existing:
        return response(404, {"message": "Task not found"})

    table.delete_item(
        Key={
            "userId": user_id,
            "taskId": task_id,
        }
    )

    return response(200, {"message": "Task deleted", "taskId": task_id})


def lambda_handler(event, context):
    try:
        http_method = event.get("httpMethod")
        path_parameters = event.get("pathParameters") or {}
        task_id = path_parameters.get("taskId")

        if http_method == "OPTIONS":
            return response(200, {"message": "CORS preflight OK"})

        user_id = get_user_id(event)

        if http_method == "POST" and task_id is None:
            return create_task(user_id, event)

        if http_method == "GET" and task_id is None:
            return list_tasks(user_id)

        if http_method == "GET" and task_id:
            return get_task(user_id, task_id)

        if http_method == "PUT" and task_id:
            return update_task(user_id, task_id, event)

        if http_method == "DELETE" and task_id:
            return delete_task(user_id, task_id)

        return response(404, {"message": "Route not found"})

    except ValueError as error:
        return response(400, {"message": str(error)})
    except ClientError as error:
        print("AWS ClientError:", str(error))
        return response(500, {"message": "Internal server error"})
    except Exception as error:
        print("Unhandled error:", str(error))
        return response(500, {"message": "Internal server error"})