// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        address issuer;
        string ipfsCid;
        uint256 issuedAt;
        bool valid;
    }

    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(bytes32 indexed certId, address indexed issuer, string ipfsCid, uint256 issuedAt);
    event CertificateRevoked(bytes32 indexed certId, address indexed issuer, uint256 revokedAt);

    modifier onlyIssuer(bytes32 certId) {
        require(certificates[certId].issuer == msg.sender, "Not issuer");
        _;
    }

    function issueCertificate(bytes32 certId, string calldata ipfsCid) external {
        require(certificates[certId].issuer == address(0), "Already issued");
        certificates[certId] = Certificate({
            issuer: msg.sender,
            ipfsCid: ipfsCid,
            issuedAt: block.timestamp,
            valid: true
        });
        emit CertificateIssued(certId, msg.sender, ipfsCid, block.timestamp);
    }

    function revokeCertificate(bytes32 certId) external onlyIssuer(certId) {
        require(certificates[certId].valid == true, "Already invalid");
        certificates[certId].valid = false;
        emit CertificateRevoked(certId, msg.sender, block.timestamp);
    }

    function getCertificate(bytes32 certId)
        external
        view
        returns (address issuer, string memory ipfsCid, uint256 issuedAt, bool valid)
    {
        Certificate memory c = certificates[certId];
        return (c.issuer, c.ipfsCid, c.issuedAt, c.valid);
    }
}
