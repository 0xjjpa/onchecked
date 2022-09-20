#!/bin/bash

cd onchecked-contracts/ && yarn && yarn typechain && cd ..
cd onchecked-app && npm install && npm run build