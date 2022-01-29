const { assert } = require("chai");

const TodoList = artifacts.require("TodoList");

contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();
    })

    it('deployed successfully', async () => {
        const address = await this.todoList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it('list tasks', async () => {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(taskCount);
        assert.equal(task.id.toNumber(), taskCount.toNumber());
    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('Complete Blockchain app today.');
        const taskCount = await this.todoList.taskCount();
        assert.equal(taskCount.toNumber(), 2);
        const event_args = result.logs[0].args;
        // console.log(event_args);
        assert.equal(event_args.description, 'Complete Blockchain app today.');
    })

    it('toggles task status', async () => {
        const task_bef = await this.todoList.tasks(1);
        const event = await this.todoList.toggleCompleted(1);
        const task_aft = await this.todoList.tasks(1);
        assert.equal(task_bef[2], !task_aft[2]);
    })
})