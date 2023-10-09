#!/bin/bash

API="http://localhost:8000"
URL_PATH="/employees"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "employees": {
      "text": "'"${TEXT}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo
