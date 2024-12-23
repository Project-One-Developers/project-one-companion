const fs = require("fs");

function persistLocalStorageToFile() {
    const players = JSON.parse(window.localStorage.getItem("players")) || [];
    fs.writeFile("players.json", JSON.stringify(players, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file", err);
        } else {
            console.log("LocalStorage data saved to players.json");
        }
    });
}
