#!/usr/bin/python

import httplib2
from pprint import pprint
import os.path

from fabric.api import task, execute, local as l

from apiclient.discovery import build
## from apiclient.http import MediaFileUpload
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.client import AccessTokenRefreshError
from oauth2client.file import Storage
from oauth2client.tools import run


# Copy your credentials from the APIs Console
CLIENT_ID = '185061562086.apps.googleusercontent.com'
CLIENT_SECRET = 'P7RTFEASQ0ur2P0PXU9JckiW'

# Check https://developers.google.com/drive/scopes for all available scopes
OAUTH_SCOPE = 'https://www.googleapis.com/auth/drive'

# Redirect URI for installed apps
REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

## # Path to the file to upload
## FILENAME = 'document.txt'

GRANT_CACHE_FILE = '.sheardrive_grant'

@task
def refreshFolder():
    """
    Fetch all the resources from the sheared gdrive folder
    """
    # Run through the OAuth flow and retrieve credentials
    flow = OAuth2WebServerFlow(CLIENT_ID, CLIENT_SECRET, OAUTH_SCOPE,
            REDIRECT_URI)
    storage = Storage(GRANT_CACHE_FILE)
    credentials = storage.get()

    if credentials is None or credentials.invalid:
        credentials = run(flow, storage)

    # Create an httplib2.Http object and authorize it with our credentials
    http = httplib2.Http()
    http = credentials.authorize(http)

    driveService = build('drive', 'v2', http=http)

    ## # Insert a file
    ## mediaBody = MediaFileUpload(FILENAME, mimetype='text/plain', resumable=True)
    ## body = {
    ## 'title': 'My document',
    ## 'description': 'A test document',
    ## 'mimeType': 'text/plain'
    ## }
    ## 
    ## # file = driveService.files().insert(body=body,
    ## #         mediaBody=mediaBody).execute()

    req = driveService.files().list().execute()
    for item in req['items']:
        orF = item.get('originalFilename')
        if orF is None:
            orF = item.get('title') + '/'
        assert orF is not None, 'Bad file type? ' + str(item.keys())
        print orF, ' ' * 20 + item['selfLink']

