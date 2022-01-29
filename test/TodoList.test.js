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
})