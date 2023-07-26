// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PasswordVault {
    address public owner;
    string public currentPassword;
    uint256 public lastPasswordUpdateTime;

    struct Credential {
        string website;
        string username;
        string password;
    }

    mapping(address => Credential[]) private userCredentials;

    event NewPasswordGenerated(string newPassword);
    event CredentialsStored(string website, string username, string password);
    event CredentialsRetrieved(Credential[] credentials);

    event CredentialsUpdated(string website, string username, string password);
    event CredentialsDeleted(string website);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        generateNewPassword();
    }

    function generateNewPassword() public onlyOwner {
        bytes32 randomHash = keccak256(
            abi.encodePacked(block.timestamp, block.difficulty, currentPassword)
        );
        currentPassword = toAlphanumericString(uint256(randomHash));
        lastPasswordUpdateTime = block.timestamp;
        emit NewPasswordGenerated(currentPassword);
    }

    function toAlphanumericString(
        uint256 num
    ) internal pure returns (string memory) {
        bytes
            memory alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        uint256 len = 6; // Password length
        bytes memory result = new bytes(len);
        for (uint256 i = 0; i < len; i++) {
            result[i] = alphabet[num % alphabet.length];
            num /= alphabet.length;
        }
        return string(result);
    }

    function login(string memory password) public view returns (bool) {
        return (keccak256(abi.encodePacked(password)) ==
            keccak256(abi.encodePacked(currentPassword)));
    }

    function timeRemainingForNextPassword() public view returns (uint256) {
        uint256 timeSinceLastUpdate = block.timestamp - lastPasswordUpdateTime;
        if (timeSinceLastUpdate >= 1440 minutes) {
            return 0;
        } else {
            return 1440 minutes - timeSinceLastUpdate;
        }
    }

    function storeCredentials(
        string memory website,
        string memory username,
        string memory password
    ) public {
        Credential memory newCredential = Credential(
            website,
            username,
            password
        );
        userCredentials[msg.sender].push(newCredential);
        emit CredentialsStored(website, username, password);
    }

    function getCredentials() public view returns (Credential[] memory) {
        return userCredentials[msg.sender];
    }

    function updateCredentials(
        string memory website,
        string memory newUsername,
        string memory newPassword
    ) public {
        Credential[] storage credentials = userCredentials[msg.sender];
        for (uint256 i = 0; i < credentials.length; i++) {
            if (keccak256(abi.encodePacked(credentials[i].website)) == keccak256(abi.encodePacked(website))) {
                credentials[i].username = newUsername;
                credentials[i].password = newPassword;
                emit CredentialsUpdated(website, newUsername, newPassword);
                return;
            }
        }
        revert("Credentials not found for the given website.");
    }

    function deleteCredentials(string memory website) public {
        Credential[] storage credentials = userCredentials[msg.sender];
        for (uint256 i = 0; i < credentials.length; i++) {
            if (keccak256(abi.encodePacked(credentials[i].website)) == keccak256(abi.encodePacked(website))) {
                delete credentials[i];
                emit CredentialsDeleted(website);
                return;
            }
        }
        revert("Credentials not found for the given website.");
    }
}
