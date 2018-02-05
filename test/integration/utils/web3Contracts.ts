import { web3, accounts, GAS_LIMIT_STANDARD } from "../web3";
import { readFileSync } from "fs";
import { join } from "path";
import { ContractInstance } from "web3";

export async function deployContract(contractName: string): Promise<ContractInstance> {
  return new Promise<ContractInstance>((resolve, reject) => {
    const dirPath = join(__dirname, "../abis");
    const fileName = `__${contractName}_sol_${contractName}`;

    const abi = JSON.parse(readFileSync(join(dirPath, fileName + ".abi"), "utf-8"));
    const bin = readFileSync(join(dirPath, fileName + ".bin"), "utf-8");
    const code = "0x" + bin;

    const contract = web3.eth.contract(abi);

    (contract as any).new({ from: accounts[0], data: code, gas: GAS_LIMIT_STANDARD }, (err: Error, contract: any) => {
      // this callback gets called multiple times
      // on a final call contract.address will be defined
      if (err) {
        reject(err);
      } else if (contract.address) {
        resolve(contract);
      }
    });
  });
}
