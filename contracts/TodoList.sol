// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount;

    struct Task {
        uint id;
        string description;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    constructor() public {
        createTask("Submit the lab session and lab assignment.");
    }

    function createTask(string memory content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, content, false);
    }


}
