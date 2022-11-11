#!/bin/sh

export $(grep -v '^#' .env | xargs)
eas update --auto
unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
