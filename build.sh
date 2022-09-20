#!/bin/bash

cd onchecked-contracts && yarn typechain && cd ..
cd onchecked-app && npm run build