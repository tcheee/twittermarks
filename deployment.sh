#!/bin/sh
npm run build --prefix client && rm -rf server/build && sleep 1 && mv ./client/build ./server/
