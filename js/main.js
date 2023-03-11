((name) => {
    name = prompt(`Enter username: `);
    if (name === '') {
        alert("You haven't entered a username...");
    } else {
        alert(`Welcome, ${name}`);
    }
})();