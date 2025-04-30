#!/bin/bash
set -euo pipefail

# Load .env variables       
source .env

docker build -t $STACK_NAME .