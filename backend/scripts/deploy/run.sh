#!/bin/bash
set -euo pipefail

# Load .env variables       
source .env

docker run -p 9000:8080 $STACK_NAME