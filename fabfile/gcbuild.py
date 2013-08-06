"""
Utilities to assist with building the apk and using the repo
"""

import os
import json
import shutil

from fabric.api import task, local as l, execute

KEYSTORE = "possiblewhale.keystore"
PW_FILE = "androidstorepass.txt"
TJ_KEY = "tapjoysecretkey.txt"


@task
def generateConfigJSON(configFile):
    """
    Create manifest.json from manifest.json.in and tapjoysecretkey.txt
    """
    tmpOut = configFile + ".out"
    with open(tmpOut, 'w') as f:
        data = json.load(open(manifestFile + ".in"))

        androidKeyStore = os.path.join(os.getcwd(), KEYSTORE)
        data['android']['keystore'] = androidKeyStore
        androidPass = open(PW_FILE).read().strip()
        data['android']['storepass'] = data['android']['keypass'] = androidPass

        json.dump(data, f, indent=4)

    shutil.move(tmpOut, configFile)



@task
def generateManifest(manifestFile):
    """
    Create manifest.json from manifest.json.in and tapjoysecretkey.txt
    """
    with open(manifestFile, 'w') as f:
        data = json.load(open(manifestFile + ".in"))

        tjKey = open(TJ_KEY).read().strip()
        data['android']["tapjoySecretKey"] = tjKey

        json.dump(data, f, indent=4)

