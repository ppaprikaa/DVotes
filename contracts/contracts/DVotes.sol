// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract DVotes {
    struct Poll {
        uint256 ID;
        address initiator;
        string title;
        string description;

        uint256 voteCount;
        uint256 optionCount;
        bool finished;
    }

    struct Option {
        uint256 ID;
        string Name;
        string IPFSPicHash;
        uint256 Votes;
    }

    mapping(uint256 => Poll) private _polls;
    mapping(uint256 => mapping(address => uint256)) private _votedForOption;
    mapping(uint256 => mapping(address => bool)) private _voted;
    mapping(uint256 => mapping(uint256 => Option)) _optionsPerPoll;
    uint256 private _pollCount = 0;

    event PollCreated();
    event PollDeleted();
    event PollFinished(uint256 pollID);
    event AddedOption(uint256 pollID);
	event Voted(uint256 pollID);
    event VoteCanceled(uint256 pollID);

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

    modifier whenNotFinished(uint256 _pollID) {
        require(!_polls[_pollID].finished, "Poll must be unfinished");
        _;
    }

    function createPoll(
        string memory _title,
        string memory _description,
        string[] calldata _optionsNames,
        string[] calldata _optionsPics
    ) external  returns (uint256) {
        require(_optionsNames.length == _optionsPics.length, "Amounts of option names and pictures must be equal");
        require(_optionsNames.length >= 2, "Minimum two options");
        _pollCount++;

        for (uint256 i = 0; i < _optionsNames.length; i++) {
            _optionsPerPoll[_pollCount][i + 1] = Option({
                ID: i + 1,
                Name: _optionsNames[i],
                IPFSPicHash: _optionsPics[i],
                Votes: 0 
            });
        }

        _polls[_pollCount] = Poll({
            ID: _pollCount,
            initiator: msg.sender,
            title: _title,
            description: _description,
            voteCount: 0,
            optionCount: _optionsNames.length,
            finished: false
        });

        emit PollCreated();
        return _pollCount;
    }

    function vote(uint256 _pollID, uint256 _optID) external whenNotFinished(_pollID) whenNotVoted(_pollID)  {
        _voted[_pollID][msg.sender] = true;
        _votedForOption[_pollID][msg.sender] = _optID;
        _optionsPerPoll[_pollID][_optID].Votes++;
        _polls[_pollID].voteCount++;
		emit Voted(_pollID);
    }

    function cancelVote(uint256 _pollID) external whenVoted(_pollID) whenNotFinished(_pollID) {
        _voted[_pollID][msg.sender] = false;
        _optionsPerPoll[_pollID][_votedForOption[_pollID][msg.sender]].Votes--;
        delete _votedForOption[_pollID][msg.sender];
        _polls[_pollID].voteCount--;
        emit VoteCanceled(_pollID);
    }
    
    function deletePoll(uint256 _id) external onlyInitiator(_id) whenNotFinished(_id) {
        uint256 optionCount = _polls[_id].optionCount;
        delete _polls[_id];
        for (uint i = 0; i < optionCount; i++) {
            delete _optionsPerPoll[_id][i+1];
        }
        emit PollDeleted();
    }

    function finishPoll(uint256 _id) external onlyInitiator(_id) whenNotFinished(_id){
        _polls[_id].finished = true;
        emit PollFinished(_id);
    }

    function addOption(
        uint256 _pollID,
        string memory _optionName,
        string memory _optionPicIPFSHash
        ) external onlyInitiator(_pollID) whenNotFinished(_pollID) {
            _polls[_pollID].optionCount++;
            _optionsPerPoll[_pollID][_polls[_pollID].optionCount] = Option({
                ID: _polls[_pollID].optionCount,
                Name: _optionName,
                IPFSPicHash: _optionPicIPFSHash,
                Votes: 0
            });
            emit AddedOption(_pollID);
        }

    function getPoll(uint256 _pollID) external view returns(Poll memory) {
        return _polls[_pollID];
    }

    function getPolls(uint256 _offset, uint256 _limit) external view returns(Poll[] memory) {
        if (_pollCount == 0) {
            return new Poll[](0);
        }

        if (_offset >= _pollCount) {
            _offset = 0;
        }

        if (_limit > 100) {
            _limit = 100;
        }

        Poll[] memory polls;

        if ((_offset + _limit - 1) > _pollCount) {
            polls = new Poll[](_pollCount - _offset);
            for (uint256 i = _offset + 1; i <= _pollCount; i++) {
                polls[i - (_offset + 1)] = _polls[i];
            }
            return polls;
        }

        polls = new Poll[](_limit);

        for (uint i = _offset + 1; i <= _offset + _limit; i++) {
            polls[i - (_offset + 1)] = _polls[i];
        }

        return polls;
    }

    function getOption(uint256 _pollID, uint256 _optionID) external view returns(Option memory) {
        return _optionsPerPoll[_pollID][_optionID];
    }

    function getOptions(uint256 _pollID) external view returns(Option[] memory) {
        Option[] memory options = new Option[](_polls[_pollID].optionCount);

        for (uint i = 1; i <= _polls[_pollID].optionCount; i++) {
            options[i - 1] = _optionsPerPoll[_pollID][i];
        }

        return options;
    }

    function getVotesPerOption(uint256 _pollID, uint256 _optionID) external view returns(uint256) {
        return _optionsPerPoll[_pollID][_optionID].Votes;
    }

    function getVotedOption(uint256 _pollID) external view returns(uint256) {
        return _votedForOption[_pollID][msg.sender];
    }
}
