"""
Utilities to assist with building the apk and using the repo
"""

import os
import json
import shutil

from fabric.api import task, local as l, execute

KEYSTORE = "possiblewhale.keystore"
PW_FILE = "androidstorepass.txt"
AF_KEY = "appfloodsecretkey.txt"


@task
def generateConfigJSON(configFile):
    """
    Create devkit/config.json from 
    - androidstorepass.txt and
    - possiblewhale.keystore
    """
    tmpOut = configFile + ".out"
    with open(tmpOut, 'w') as f:
        data = json.load(open(configFile))

        androidKeyStore = os.path.join(os.getcwd(), KEYSTORE)
        data['android']['keystore'] = androidKeyStore
        androidPass = open(PW_FILE).read().strip()
        data['android']['storepass'] = data['android']['keypass'] = androidPass

        json.dump(data, f, indent=4)

    shutil.move(tmpOut, configFile)



@task
def generateManifest(manifestFile):
    """
    Create manifest.json from 
    - manifest.json.in and 
    - appfloodsecretkey.txt
    """
    with open(manifestFile, 'w') as f:
        data = json.load(open(manifestFile + ".in"))

        afKey = open(AF_KEY).read().strip()
        data['android']["appFloodSecretKey"] = afKey
        data['ios']["appFloodSecretKey"] = afKey

        json.dump(data, f, indent=4)


@task
def generateLocalConfig(localFile, build):
    """
    Create resources/conf/localconfig.json and set the build values
    appropriately.
    """
    tmpOut = localFile + ".out"
    with open(tmpOut, 'w') as f:
        if os.path.exists(localFile):
            data = json.load(open(localFile))
        else:
            data = {}

        if build == 'debug-android' or build == 'debug-ios':
            data['release'] = "debug"
        elif build == 'ads-android' or build == 'ads-ios':
            data['release'] = "ads"
        elif build == 'paid-android' or build == 'paid-ios':
            data['release'] = "paid"
        else:
            assert 0, "run with build=something"

        # force off the debug flag while building.
        if data['release'] in ['paid', 'ads']:
            data['debug'] = False

        json.dump(data, f, indent=4)

    shutil.move(tmpOut, localFile)
