const API_URL = "https://kal.baitan.ch/api.php";
const convListDOM = document.querySelector("#contacts-list");

let currentUserConnected = "";
let globalConvName = "";
let convList = [];

/**
 * La fonction qui initialise toutes les variables / intervales
 */
async function main() {

    // Demander le nom d'utilisateur pour identifier l'utilisateur
    currentUserConnected = prompt("Entre votre nom");
    document.querySelector("#currentUser").textContent = currentUserConnected;

    let resp = await fetch(API_URL);
    let convs = await resp.json();

    convs.conversations.forEach(async element => {
        let conv = new Conv(element);
        convList.push(conv) 
    });

    //Affiche les convs dans la nav bar
    convList.forEach((element) => {
        convListDOM.innerHTML += element.generateHTMLSidebarContact();
    });
    
    // Ecrit le dernier message
    convList.forEach(async (e) => {
        document.querySelector(`[data-lastmess-${e.name.split('.')[0]}]`).textContent = await e.getLastMessage();
    })

    // Mets a jour la navbar toutes les 5 secondes
    setInterval(async () => {
        resp = await fetch(API_URL);
        convs = await resp.json();

        // redefini la liste de conversation avec la nouvelle recue
        convList = [];
        convs.conversations.forEach(async element => {
            let conv = new Conv(element);
            convList.push(conv) 
        });

        convListDOM.innerHTML = "";
        
        //Affiche la conv dans la nav bar
        convList.forEach((element) => {
            convListDOM.innerHTML += element.generateHTMLSidebarContact();
        });
        
        // Ecrit le dernier message
        convList.forEach(async (e) => {
            document.querySelector(`[data-lastdate-${e.name.split('.')[0]}]`).textContent = await e.getLastHour();
            document.querySelector(`[data-lastmess-${e.name.split('.')[0]}]`).textContent = await e.getLastMessage();
        })
    }, 5000)

    

    // Mets a jours les messages toutes les secondes
    setInterval(() => {
        generateChat(globalConvName);
    }, 1000);
}

/**
 * Permet d'envoyer un message dans une conversation
 * @param {Event} event 
 */
function sendMessage(event){
    event.preventDefault();
    let form = event.target;

    let message = Object.fromEntries(new FormData(form)).messageInput;

    const payload = {
        "conversation" : globalConvName,
        "messages" : {
            "from" : currentUserConnected,
            "content" : message,
            "to" : "dnuia"
        }
    }
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    document.querySelector("#messages").innerHTML += 
    `<div class="mb-3 text-end">
        <div class="message out">${message}</div>
    </div>`;

    document.querySelector("#message-input").value = ""; 
}

/**
 * Permet de créer un nouveau tchat
 * @param {Event} e 
 */
function createNewChat(e){
    e.preventDefault();

    document.querySelector("#messages").innerHTML = "";
    globalConvName = prompt("Entrez le nom de la conversation")
}

function onSideBarClick(e){
    if(e.target !== document.querySelector("#contact-search")){
        toggleSideBar();
    }
}

/**
 * Permet d'afficher le message d'une conversation dans la zone de text
 * @param {string} convName le nom de la conversation
 */
function generateChat(convName) {
    globalConvName = convName;
    convList.forEach(element => {
        if (convName === element.name) {
            document.querySelector("#chat-name").textContent = element.name;
            element.generateHTMLChat(currentUserConnected);
        }
    });
}

/**
 * Permet d'alterner entre ouvert et fermer pour le nav
 */
function toggleSideBar() {
    const sideBar = document.querySelector("#sidebar");

    if (sideBar.classList.contains("show")) {
        document.querySelector("#sidebar").classList.remove("show");
    }
    else{
        document.querySelector("#sidebar").classList.add("show");
    }
}

/**
 * Permet d'ouvrir la navbar
 */
function showSideBar() {
    document.querySelector("#sidebar").classList.add("show");
}

/**
 * Permet de fermer la navbar
 */
function hideSideBar() {
    document.querySelector("#sidebar").classList.remove("show");
}


function escapeHTML(string){
 var MAP = new Map([
   ['&', '&amp;'],
   ['<', '&lt;'],
   ['>', '&gt;'],
   ['/', '&#47;'],
 ]);

 MAP.forEach((element, key) => {
    string = string.replace(key, element)
 });

 return string;
}