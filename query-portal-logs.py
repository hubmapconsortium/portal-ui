#!/usr/bin/env python3

import boto3
import time
from datetime import datetime, timedelta
from csv import DictWriter


def combine_field_and_value_to_item(d):
    return {d['field']: d['value']}


if __name__ == "__main__":
    client = boto3.Session(profile_name='harvarddev').client('logs')

    query = client.start_query(
        logGroupName='portal-ui-logs',
        startTime=int((datetime.now() - timedelta(days=7)).timestamp()),
        endTime=int(datetime.now().timestamp()),
        queryString="""fields @timestamp, @logStream, @message
        | filter @message like /(?i)(error|exception)/
        | sort @timestamp desc""",
        limit=200
    )

    query_id = query['queryId']

    response = None

    while response is None or response['status'] == 'Running':
        print('Waiting for query to complete')
        time.sleep(5)
        response = client.get_query_results(
            queryId=query_id
        )

    if response['status'] == "Complete":
        with open(f"./portal-logs-errors/errors-{datetime.now().strftime('%d-%m-%Y')}.csv",
                  'w', newline='') as csvfile:
            fieldnames = ['first_name', 'last_name']
            writer = DictWriter(csvfile, fieldnames=[
                                '@timestamp', '@logStream', '@message', '@ptr'])
            writer.writeheader()

            for result in response['results']:
                writer.writerow({k: v for d in result for k,
                                v in combine_field_and_value_to_item(d).items()})
    else:
        raise Exception('Error retrieving query results.')
