// const Web3 = require('web3')

App = {
    loading: false,
    contracts: {},
    
    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    // loadWeb3 -> understand it as connectToBlockChain

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Accounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Accounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        console.log("account is : " + App.account)
    },

    loadContract: async () => {
        // create a js version of the smart contract,
        const todoList = await $.getJSON('TodoList.json');
        console.log("todoList is : ");
        console.log(todoList);
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3Provider);

        // hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed();
    },

    render : async () => {
        // prevent double rendering,
        if(App.loading) {
            return;
        }

        // update app loading status,
        App.setLoading(true);


        // render account,
        $('#account').html(App.account);

        // render tasks,
        await App.renderTasks();

        // update app loading status,
        App.setLoading(false);
    },

    renderTasks : async () => {
        // load the tasks form the blockchain,
            // we can't fetch all the tasks mapping all at a time,
            // so we need taskCount and then render one at a time,
        const taskCount = await App.todoList.taskCount();
        console.log("taskCount is : " + taskCount)
        const $taskTemplate = $('.taskTemplate');

        // render each task with the task template,
        for(let id = 1; id <= taskCount; id++) {
            const task = await App.todoList.tasks(id);
            // console.log(task[0])
            const taskID = task[0].toNumber();
            const taskDescription = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskDescription);
            $newTaskTemplate.find('input')
                            .prop('name', taskID)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted)

            if(taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate);
            }
            else {
                $('#taskList').append($newTaskTemplate);
            }
            
            // show task
            $newTaskTemplate.show();
        }


    },


    createTask : async () => {
        App.setLoading(true);
        const content = $('#newTask').val();
        console.log("content : " + content);
        const event = await App.todoList.createTask(content);
        console.log("event is : " + event);
        console.log("new task id : " + event.logs[0].args.id.toNumber());
        window.location.reload();
    },

    toggleCompleted : async (e) => {
        App.setLoading(true);

        const taskID = e.target.name;
        console.log("task id : " + taskID);
        const event = await App.todoList.toggleCompleted(taskID);
        window.location.reload();
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');

        if(boolean) {
            loader.show();
            content.hide();
        }
        else {
            loader.hide();
            content.show();
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})