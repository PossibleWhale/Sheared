"""
Tasks to aid with management of image and audio resources
"""

import json

from fabric.api import task, local as l, execute


@task
def checkManifests(path="."):
    """
    Make sure all json files parse successfully
    """
    files = l("find {path} -name '*.json'".format(path=path), capture=True
            ).strip().split()
    for f in files:
        try:
            json.load(open(f))
            print "OK: " + f
        except ValueError, e:
            print "** Unparseable: {f} -- because {reason}".format(f=f, reason=e)
