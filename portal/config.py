import os


GLOBUS_CLIENT_ID = os.environ.get("GLOBUS_CLIENT_ID")
if not GLOBUS_CLIENT_ID:
    raise ValueError("No GLOBUS_CLIENT_ID envar set")

GLOBUS_CLIENT_SECRET = os.environ.get("GLOBUS_CLIENT_SECRET")
if not GLOBUS_CLIENT_SECRET:
    raise ValueError("No GLOBUS_CLIENT_SECRET envar set")
