import dbm
import subprocess

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()
# Allow Cors for the Svelte devserver:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "wgcc_names.db"


@app.get("/ping")
def ping():
    return "pong"


wg_peer_keys = [
    "public_key",
    "preshared_key",
    "endpoint",
    "allowed_ips",
    "latest_handshake",
    "transfer_rx",
    "transfer_tx",
    "persistent_keepalive",
]


@app.get("/wgdump")
def get_wgdump():
    result = subprocess.run(
        ["wg", "show", "all", "dump"],
        capture_output=True,
    )

    # Parse output lines of 'wg show all dump':
    wg_conf = {}
    interface = ""
    for line in result.stdout.splitlines():
        line_parts = line.decode().split()
        if line_parts[0] != interface or interface == "":
            # We have reached a new interface, so the line is different:
            interface = line_parts[0]
            wg_conf[interface] = [
                {
                    "type": "interface",
                    "public_key": line_parts[1],
                    "port": line_parts[3],
                }
            ]
            continue

        peer_dict = dict(zip(wg_peer_keys, line_parts[1:]))
        peer_dict["type"] = "peer"
        peer_dict["name"] = ""
        try:
            with dbm.open(DB_PATH, "r") as db:
                peer_dict["name"] = db.get(peer_dict["public_key"], b"").decode()
        except dbm.error:
            pass

        wg_conf[interface].append(peer_dict)

    return wg_conf


@app.post("/setpeername")
def get_set_name(public_key: str, name: str):
    with dbm.open(DB_PATH, "c") as db:
        db[public_key] = name
    return Response("Name set", 201)


# PUT /createpeer
# ===============
class NewPeer(BaseModel):
    interface: str
    name: str
    allowed_ips: str


def generate_keypair():
    private_key = (
        subprocess.run(
            "wg genkey",
            shell=True,
            capture_output=True,
        )
        .stdout.decode()
        .strip()
    )
    public_key = (
        subprocess.run(
            f"echo {private_key} | wg pubkey",
            shell=True,
            capture_output=True,
        )
        .stdout.decode()
        .strip()
    )
    return private_key, public_key


@app.put("/createpeer")
def put_createpeer(new_peer: NewPeer):
    print(new_peer)
    private_key, public_key = generate_keypair()
    result = subprocess.run(
        [
            "wg",
            "set",
            new_peer.interface,
            "peer",
            public_key,
            "allowed-ips",
            new_peer.allowed_ips,
        ]
    )
    print(result)
    with dbm.open(DB_PATH, "c") as db:
        db[public_key] = new_peer.name
    return Response("Peer Created", 201)
