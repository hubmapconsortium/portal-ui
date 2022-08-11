#!/usr/bin/env python3

import boto3
import time
from datetime import date, datetime, timedelta
from csv import DictWriter
import sys
from pathlib import Path

for path in Path(__file__).parents:
    if (path / '.git').is_dir():
        sys.path.append(str(path))
        break

if __name__ == "__main__":
    client = boto3.Session(profile_name='harvarddev').client('logs')

    boto3.client('logs').waiter_names
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
        with open(f"portal-logs-errors/errors-{date.today()}.csv",
                  'w', newline='') as csvfile:
            writer = DictWriter(csvfile, fieldnames=[
                                '@timestamp', '@logStream', '@message', '@ptr'])
            writer.writeheader()

            for result in response['results']:
                writer.writerow({d['field']: d['value'] for d in result})
    else:
        raise Exception('Error retrieving query results.')
