class Conv {

    constructor(name) {
        this.name = name;
    }

    async init() { }

    async generateHTMLChat(currentUserConnected) {
        const messageListDOM = document.querySelector("#messages");
        let html = "";
        
        let resp = await fetch(`${API_URL}?conversation=${this.name}`);
        this.messages = await resp.json();

        this.messages.messages.forEach(message => {
            if (message.From === currentUserConnected) {
                html += `<div class="mb-3 text-end">
                            <div class="message out">${marked.parse(escapeHTML(message.Content))}</div>
                        </div>`;
            }
            else {
                html += `<div class="mb-3 text">
                            <div class="message in">${marked.parse(escapeHTML(message.Content))}</div>
                        </div>`;
            }
        });

        messageListDOM.innerHTML = html;
    }

    async getLastMessage(){
        let resp = await fetch(`${API_URL}?conversation=${this.name}`);
        this.messages = await resp.json();

        return this.messages.messages[this.messages.messages.length - 1].Content;
    }
    
    async getLastHour(){
        let resp = await fetch(`${API_URL}?conversation=${this.name}`);
        this.messages = await resp.json();

        return this.messages.messages[this.messages.messages.length - 1].SentAt.split("+")[0];
    }

    generateHTMLSidebarContact() {
        return `<div class="list-group-item list-group-item-action contact-item d-flex align-items-center" onclick="generateChat('${this.name}')" data-${this.name}="">
                    <img src="https://cdn-icons-png.flaticon.com/512/166/166258.png" alt="B" class="avatar me-2">
                    <div class="flex-grow-1">
                    <div class="d-flex justify-content-between"><strong>${this.name}</strong><small class="text-muted" data-lastdate-${this.name.split('.')[0]}></small></div>
                    <div style="max-width: 300px;" class="text-muted small text-truncate" data-lastmess-${this.name.split('.')[0]}></div>
                    </div>
                </div>`
    }
}