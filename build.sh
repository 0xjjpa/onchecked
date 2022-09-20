#!/bin/bash

yarn workspace onchecked-contracts compile
yarn workspace onchecked-contracts typechain
yarn workspace onchecked-app build