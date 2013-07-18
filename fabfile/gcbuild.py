"""
Utilities to assist with building the apk and using the repo
"""

import json

from fabric.api import task, local as l, execute


@task
def generateManifest():
    """
    Create manifest.json from manifest.json.in and tapjoysecretkey.txt
    """
    with open('manifest.json', 'w') as f:
        data = json.load(open('manifest.json.in'))
        skey = open('tapjoysecretkey.txt').read().strip()
        data['android']["tapjoySecretKey"] = skey
        json.dump(data, f, indent=4)
