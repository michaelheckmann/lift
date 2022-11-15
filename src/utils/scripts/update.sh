#!/bin/sh

# Loads the env variables before calling eas update
export $(grep -v '^#' .env | xargs)
eas update --auto
unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
