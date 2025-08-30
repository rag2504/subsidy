export const domain = (chainId: number, verifyingContract: string) => ({
  name: "GH2Subsidy", version: "1", chainId, verifyingContract
});

export const types = {
  Attestation: [
    { name: "milestoneId", type: "bytes32" },
    { name: "value",       type: "uint256" },
    { name: "dataHash",    type: "bytes32" },
    { name: "deadline",    type: "uint256" },
    { name: "nonce",       type: "uint256" }
  ]
};
