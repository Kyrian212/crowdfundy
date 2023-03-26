// Crowdfunding.sol

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
mapping(address => uint256) contributions;

    struct Project {
        string name;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 totalContributions;
        bool completed;
        bool goalReached;
        
        address payable[] contributors;
    }

    Project[] public projects;
    
    event GoalReached(uint projectId, uint amountRaised);
    event FundingReceived(uint projectId, address contributor, uint amount );

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProject(string memory _name, string memory _description, uint _goal) public onlyOwner {
        Project memory project =  Project({
            name: _name,
            description: _description,
            goal: _goal,
            deadline: block.timestamp + 3 days,
            totalContributions: 0,
            completed: false,
            goalReached: false,
            contributors: new address payable[](0)
        });
        projects.push(project);
    }

  

     function contribute(uint256 amount, uint _projectId) public payable {
        Project storage project = projects[_projectId];
        require(!project.completed, "Project has already been completed.");
        require(block.timestamp < project.deadline, "Project deadline has passed.");
        contributions[msg.sender] += amount;
        project.totalContributions += amount;
        if (contributions[msg.sender] == amount) {
            project.contributors.push(payable(msg.sender));
        }
        emit FundingReceived(_projectId, msg.sender, amount);
        checkGoalReached(_projectId);
    }

   
     function checkGoalReached(uint _projectId) internal {
        Project storage project = projects[_projectId];
        if (project.totalContributions >= project.goal && !project.goalReached) {
            project.goalReached = true;
            emit GoalReached(_projectId, project.totalContributions);
        }
    }

      function complete(uint _projectId) public onlyOwner {
        Project storage project = projects[_projectId];
        require(block.timestamp >= project.deadline, "Project deadline has not passed.");
        require(!project.completed, "Project has already been completed.");
        project.completed = true;
        if (project.goalReached) {
            address payable ownerPayable = payable(owner);
            ownerPayable.transfer(address(this).balance);
        } else {
            for (uint i = 0; i < project.contributors.length; i++) {
                address payable contributor = project.contributors[i];
                uint contribution = contributions[contributor];
                if (contribution > 0) {
                    contributor.transfer(contribution);
                }
            }
        }
    }

    function getProjects() public view returns (Project[] memory) {
    return projects;
}

}