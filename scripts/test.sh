#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

mode=$1

echo "Cleanup"

cd ./test/integration/contracts/
ABI_DIR="../abis"
rm -rf $ABI_DIR

echo "Generating ABIs for sample contracts"
../../../node_modules/.bin/solcjs --abi ./* --bin -o $ABI_DIR
echo "Compiling truffle project"
(cd ../targets/truffle && ../../../../node_modules/.bin/truffle compile)

if [ "$mode" = "COVERAGE" ]; then
  yarn test:mocha:coverage
else
  yarn test:mocha
fi

echo "Type checking generated wrappers"
yarn tsc --noUnusedParameters
yarn tsc:truffle
(cd ../targets/truffle && ../../../../node_modules/.bin/truffle test)
(cd ../targets/web3-1.0.0 && yarn && yarn test)

if [ "$mode" = "COVERAGE" ]; then
  echo "Sending coverage report"
  yarn coveralls
fi