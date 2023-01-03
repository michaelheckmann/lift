#!/bin/sh

# Generates a UUID using the typescript function
echo Input prefix:
read prefix
npx ts-node /Users/michaelheckmann/WebDev/lift/src/utils/functions/generateUUID.ts $prefix