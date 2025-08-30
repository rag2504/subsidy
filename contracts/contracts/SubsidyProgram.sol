// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract SubsidyProgram is AccessControl, EIP712 {
    using ECDSA for bytes32;
    bytes32 public constant GOV_ROLE     = keccak256("GOV_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant BANK_ROLE    = keccak256("BANK_ROLE");

    constructor(address gov) EIP712("GH2Subsidy","1") {
        _grantRole(DEFAULT_ADMIN_ROLE, gov);
        _grantRole(GOV_ROLE, gov);
    }

    struct Program { bytes32 id; string name; string currency; bool active; }
    struct Project { bytes32 id; bytes32 programId; address producer; bool approved; }
    struct Milestone {
        bytes32 id; bytes32 projectId; string code;
        uint256 target; uint8 comparator; uint256 maxPayout; string unit;
        bool attested; uint256 value; bytes32 dataHash; bool released;
    }

    mapping(bytes32=>Program)  public programs;
    mapping(bytes32=>Project)  public projects;
    mapping(bytes32=>Milestone) public milestones;

    struct Attestation { bytes32 milestoneId; uint256 value; bytes32 dataHash; uint256 deadline; uint256 nonce; }
    bytes32 private constant ATTESTATION_TYPEHASH =
        keccak256("Attestation(bytes32 milestoneId,uint256 value,bytes32 dataHash,uint256 deadline,uint256 nonce)");
    mapping(bytes32=>uint256) public milestoneNonces;

    event ProgramCreated(bytes32 indexed programId, string name);
    event ProjectApproved(bytes32 indexed projectId, address producer);
    event MilestoneDefined(bytes32 indexed milestoneId, bytes32 projectId, string code, uint256 maxPayout);
    event Attested(bytes32 indexed milestoneId, address attestor, uint256 value, bytes32 dataHash);
    event Released(bytes32 indexed milestoneId, uint256 amount, bytes32 bankRef);
    event Revoked(bytes32 indexed milestoneId, string reason);
    event ClawedBack(bytes32 indexed milestoneId, uint256 amount);

    function createProgram(bytes32 programId, string calldata name, string calldata currency) external onlyRole(GOV_ROLE) {
        require(!programs[programId].active, "exists");
        programs[programId] = Program(programId,name,currency,true);
        emit ProgramCreated(programId,name);
    }
    function approveProject(bytes32 projectId, bytes32 programId, address producer) external onlyRole(GOV_ROLE) {
        require(programs[programId].active, "bad program");
        projects[projectId] = Project(projectId, programId, producer, true);
        emit ProjectApproved(projectId, producer);
    }
    function defineMilestone(bytes32 msId, bytes32 projectId, string calldata code, uint256 target, uint8 comparator, uint256 maxPayout, string calldata unit) external onlyRole(GOV_ROLE) {
        require(projects[projectId].approved, "not approved");
        require(milestones[msId].projectId == 0x0, "exists");
        milestones[msId] = Milestone(msId, projectId, code, target, comparator, maxPayout, unit, false, 0, 0x0, false);
        emit MilestoneDefined(msId, projectId, code, maxPayout);
    }

    function attestMilestone(Attestation calldata a, bytes calldata sig) external {
        Milestone storage m = milestones[a.milestoneId];
        require(m.projectId != 0x0, "unknown");
        require(block.timestamp <= a.deadline, "expired");
        require(a.nonce == milestoneNonces[a.milestoneId] + 1, "bad nonce");
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
          ATTESTATION_TYPEHASH, a.milestoneId, a.value, a.dataHash, a.deadline, a.nonce
        )));
        address signer = ECDSA.recover(digest, sig);
        require(hasRole(AUDITOR_ROLE, signer), "not auditor");
        m.attested = true; m.value = a.value; m.dataHash = a.dataHash;
        milestoneNonces[a.milestoneId] = a.nonce;
        emit Attested(a.milestoneId, signer, a.value, a.dataHash);
    }

    function releasePayment(bytes32 msId, uint256 amount, bytes32 ref) external onlyRole(GOV_ROLE) {
        Milestone storage m = milestones[msId];
        require(m.attested, "not attested");
        require(!m.released, "already");
        require(amount <= m.maxPayout, "over cap");
        m.released = true;
        emit Released(msId, amount, ref);
    }

    function revoke(bytes32 msId, string calldata reason) external onlyRole(GOV_ROLE) {
        Milestone storage m = milestones[msId];
        require(!m.released, "released");
        m.attested = false;
        emit Revoked(msId, reason);
    }

    function clawback(bytes32 msId, uint256 amount) external onlyRole(GOV_ROLE) {
        emit ClawedBack(msId, amount);
    }

    function setRole(bytes32 role, address account, bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (enabled) _grantRole(role, account); else _revokeRole(role, account);
    }
}
