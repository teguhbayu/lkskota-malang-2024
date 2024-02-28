import boto3
from decimal import decimal
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('####')

def lambda_handler(event,context):
    process_and_save_data(event)

def process_and_save_data(payload):
    payload['temperature'] = Decimal(str(payload['temperature']))
    payload['humidity'] = Decimal(str(payload['humidity']))

    response = table.put_item(Item=payload)
    print(f'Data success: {response}')