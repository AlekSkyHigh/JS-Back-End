const eventBus = require('./eventBus');

eventBus.subscribe('user-added', () => {
    console.log('New user is added');
});

const unsubscribe = eventBus.subscribe('user-added', (username, age) => {
    console.log(`New user is added 2: ${username} (${age}) years old`);
});

eventBus.subscribe('user-remove', () => {
    console.log('User is removed');
});

eventBus.publish('user-added', 'Pesho', 20);
eventBus.publish('user-remove');

unsubscribe();
eventBus.publish('user-added', 'Pesho', 20);
