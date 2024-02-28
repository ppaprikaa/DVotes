// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract DVotes {
    struct Poll {
        address initiator;
        string title;
        string description;

        uint256 voteCount;
        uint256 optionCount;
        string[] optionNames;
        string[] optionPicIPFSHashes;
        bool destroyed;
    }

    mapping(uint256 => Poll) private _polls;
    mapping(uint256 => mapping(uint256 => uint256)) private _votesPerOption;
    mapping(uint256 => mapping(address => uint256)) private _votedPerOption;
    mapping(uint256 => mapping(address => bool)) private _voted;
    uint256 private _pollCount = 0;

    event PollCreated(uint256 ID);


    modifier onlyInitiator(uint256 _pollID) {
        require(msg.sender == _polls[_pollID].initiator, "You must be initiator of poll");
        _;
    }

    modifier whenNotVoted(uint256 _pollID) {
        require(!_voted[_pollID][msg.sender]);
        _;
    }

    modifier whenVoted(uint256 _pollID) {
        require(_voted[_pollID][msg.sender]);
        _;
    }

    modifier whenNotDestroyed(uint256 _pollID) {
        require(!_polls[_pollID].destroyed, "Poll must be alive");
        _;
    }

    function createPoll(
        string memory title_,
        string memory _description,
        string[] calldata _optionNames,
        string[] calldata _optionsPics
    ) external  returns (uint256) {
        require(_optionNames.length == _optionsPics.length, "Amounts of option names and pictures must be equal");
        require(_optionNames.length >= 2, "Minimum two options");
        _pollCount++;

        for (uint256 i = 0; i < _optionNames.length; i++) {
            
        }

        _polls[_pollCount] = Poll({
            initiator: msg.sender,
            title: title_,
            description: _description,
            voteCount: 0,
            optionNames: _optionNames,
            optionPicIPFSHashes: _optionsPics,
            optionCount: _optionNames.length,
            destroyed: false
        });

        emit PollCreated(_pollCount);
        return _pollCount;
    }

    function getPoll(uint256 _pollID) external view returns(Poll memory) {
        return _polls[_pollID];
    }

    function vote(uint256 _pollID, uint256 _optID) external whenNotDestroyed(_pollID) whenNotVoted(_pollID)  {
        _voted[_pollID][msg.sender] = true;
        _votedPerOption[_pollID][msg.sender] = _optID;
        _votesPerOption[_pollID][_optID]++;
        _polls[_pollID].voteCount++;
    }

    function cancelVote(uint256 _pollID) external whenVoted(_pollID) whenNotDestroyed(_pollID) {
        _voted[_pollID][msg.sender] = false;
        _votesPerOption[_pollID][_votedPerOption[_pollID][msg.sender]]--;
        delete _votedPerOption[_pollID][msg.sender];
        _polls[_pollID].voteCount -= 1;
    }
    
    function deletePoll(uint256 _id) external onlyInitiator(_id) {
        delete _polls[_id];
    }

    function destroyPoll(uint256 _id) external onlyInitiator(_id) {
        _polls[_id].destroyed = true;
    }

    function addOption(
        uint256 _pollID,
        string memory _optionName,
        string memory _optionPicIPFSHash
        ) external onlyInitiator(_pollID) whenNotDestroyed(_pollID) {
            _polls[_pollID].optionNames.push(_optionName);
            _polls[_pollID].optionPicIPFSHashes.push(_optionPicIPFSHash);
            _polls[_pollID].optionCount++;
        }
}