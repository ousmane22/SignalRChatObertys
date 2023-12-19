"use strict"; 

// Création d'une connexion au hub
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();


document.getElementById("sendMessagebtn").disabled = true;

console.log("Attaching event handler...");

// Gestionnaire d'événement pour recevoir les messages du hub
connection.on("ReceiveMessage", function (user, message) {
    console.log("Message received:", user, message);
    appendMessage('received', user, message);
});

console.log("Starting connection...");

// Démarrage de la connexion au hub
connection.start().then(function () {
    console.log("Connection started.");
    document.getElementById("sendMessagebtn").disabled = false;
}).catch(function (err) {
    console.error("Error starting connection:", err.toString());
});


document.getElementById("sendMessagebtn").addEventListener("click", function (e) {
    e.preventDefault();

    var user = "";
    var messageInput = document.getElementById("message");
    var message = messageInput.value;

    console.log("Sending message...");

    // Appel de la méthode du hub pour envoyer un message
    connection.invoke("SendMessage", user, message).catch(function (error) {
        console.error("Error invoking SendMessage:", error.toString());
    });

    messageInput.value = "";
});

// Fonction pour ajouter un message à la liste des messages
function appendMessage(type, user, message) {
    var messageList = document.getElementById('message-list');

    var li = document.createElement('li');
    li.className = 'clearfix';

    var messageData = document.createElement('div');
    messageData.className = 'message-data text-right';
    var messageDataTime = document.createElement('span');
    messageDataTime.className = 'message-data-time';
    messageDataTime.textContent = getCurrentTime();
    var img = document.createElement('img');
    img.src = 'https://bootdey.com/img/Content/avatar/avatar7.png';
    img.alt = 'avatar';
    messageData.appendChild(messageDataTime);
    messageData.appendChild(img);

    var messageText = document.createElement('div');
    messageText.className = 'message ' + (type === 'sent' ? 'self-message' : 'other-message') + ' float-right';
    messageText.textContent = `${user} ${message}`;

    li.appendChild(messageData);
    li.appendChild(messageText);

    messageList.appendChild(li);

    
    messageList.scrollTop = messageList.scrollHeight;
}

// Fonction pour obtenir l'heure actuelle 
function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes + ' ' + ampm;
    return timeString;
}
