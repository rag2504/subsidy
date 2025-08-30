import { ethers } from "ethers";

// We'll copy the ABI from Hardhat build artifacts
const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "gov",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "milestoneId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "attestor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "Attested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "milestoneId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bankRef",
        "type": "bytes32"
      }
    ],
    "name": "Released",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "milestoneId",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "dataHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubsidyProgram.Attestation",
        "name": "a",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "sig",
        "type": "bytes"
      }
    ],
    "name": "attestMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "projectId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "programId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "producer",
        "type": "address"
      }
    ],
    "name": "approveProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "programId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "currency",
        "type": "string"
      }
    ],
    "name": "createProgram",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "msId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "projectId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "code",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "target",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "comparator",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "maxPayout",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "unit",
        "type": "string"
      }
    ],
    "name": "defineMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "msId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "releasePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const RPC = process.env.CHAIN_RPC || "http://127.0.0.1:8545";

// Lazy initialization to avoid build-time errors
let _provider: ethers.providers.JsonRpcProvider | null = null;
let _govWallet: ethers.Wallet | null = null;
let _auditorWallet: ethers.Wallet | null = null;
let _contract: ethers.Contract | null = null;

function getProvider(): ethers.providers.JsonRpcProvider {
  if (!_provider) {
    _provider = new ethers.providers.JsonRpcProvider(RPC);
  }
  return _provider;
}

function getGovWallet(): ethers.Wallet {
  if (!_govWallet) {
    const privateKey = process.env.GOV_PRIVATE_KEY;
    if (!privateKey) throw new Error("GOV_PRIVATE_KEY missing");
    _govWallet = new ethers.Wallet(privateKey, getProvider());
  }
  return _govWallet;
}

function getAuditorWallet(): ethers.Wallet {
  if (!_auditorWallet) {
    const privateKey = process.env.AUDITOR_PRIVATE_KEY;
    if (!privateKey) throw new Error("AUDITOR_PRIVATE_KEY missing");
    _auditorWallet = new ethers.Wallet(privateKey, getProvider());
  }
  return _auditorWallet;
}

function getContract(): ethers.Contract {
  if (!_contract) {
    const ADDR = process.env.CONTRACT_ADDRESS;
    if (!ADDR) throw new Error("CONTRACT_ADDRESS missing");
    _contract = new ethers.Contract(ADDR, abi, getGovWallet());
  }
  return _contract;
}

// Export getter functions instead of direct values to avoid build-time evaluation
export const provider = getProvider;
export const govWallet = getGovWallet;
export const auditorWallet = getAuditorWallet;
export const contract = getContract;
