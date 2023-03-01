import { ethers } from "ethers";
const textEncoder = new TextEncoder();

export default function convertToParentNode(label) {
  const x0 = 0;
  const x1 = ethers.utils.keccak256(textEncoder.encode("eth"));
  const eth = ethers.utils.solidityKeccak256(["uint256", "bytes32"], [x0, x1]);
  const labelHash = ethers.utils.keccak256(textEncoder.encode(label));
  const parentNode = ethers.utils.solidityKeccak256(
    ["bytes32", "bytes32"],
    [eth, labelHash]
  );
  return parentNode;
}
