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

    event TaskCreated(
        uint id,
        string description,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Submit the lab session and lab assignment.");
    }

    function createTask(string memory content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, content, false);

        emit TaskCreated(taskCount, content, false);
    }

    function toggleCompleted(uint id) public {
        Task memory task = tasks[id];
        task.completed = !task.completed;
        tasks[task.id] = task;

        emit TaskCompleted(id, task.completed);
    }

}
