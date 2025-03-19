addEventListener("DOMContentLoaded", (event) => {
    // Create console elements
    const consoleToggle = document.createElement("div");
    const customConsole = document.createElement("div");
    const consoleOutput = document.createElement("div");
    const consoleInputContainer = document.createElement("div");
    const consoleInput = document.createElement("input");
    const consoleButton = document.createElement("button");

    // Set element IDs
    consoleToggle.id = "consoleToggle";
    customConsole.id = "customConsole";
    consoleOutput.id = "consoleOutput";
    consoleInput.id = "consoleCommand";
    consoleButton.innerText = "Run";

    // Add styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
    #consoleToggle {
        position: fixed;
        bottom: 20px;
        left: 10px;
        width: 50px;
        height: 50px;
        background-color: #007acc;
        color: #fff;
        font-size: 24px;
        text-align: center;
        line-height: 50px;
        border-radius: 50%;
        cursor: move;
        z-index: 1001;
        font-family: sans-serif;
    }
    #customConsole {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 250px;
        background-color: #1e1e1e;
        color: #dcdcdc;
        font-family: monospace;
        font-size: 14px;
        display: none;
        flex-direction: column;
        border-top: 2px solid #333;
        z-index: 1000;
    }
    #consoleOutput {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    #consoleInputContainer {
        display: flex;
        border-top: 1px solid #333;
    }
    #consoleCommand {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
        background-color: #2d2d2d;
        color: #dcdcdc;
    }
    #consoleInputContainer button {
        padding: 10px;
        border: none;
        background-color: #007acc;
        color: #fff;
        cursor: pointer;
    }
    #consoleInputContainer button:hover {
        background-color: #005f99;
    }
`;
    document.head.appendChild(style);

    // Append elements to body
    document.body.appendChild(consoleToggle);
    document.body.appendChild(customConsole);
    customConsole.appendChild(consoleOutput);
    customConsole.appendChild(consoleInputContainer);
    consoleInputContainer.appendChild(consoleInput);
    consoleInputContainer.appendChild(consoleButton);

    consoleToggle.innerHTML = "≡";

    // Toggle console visibility
    function toggleConsole() {
        customConsole.style.display = customConsole.style.display === "none" ? "flex" : "none";
    }

    // Make the console toggle button draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = function (e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    makeDraggable(consoleToggle);

    // Toggle console on double-click of the toggle button
    consoleToggle.ondblclick = toggleConsole;

    // Override F12 key to toggle the custom console
    document.addEventListener("keydown", function (event) {
        if (event.key === "F12") {
            event.preventDefault();
            toggleConsole();
        }
        if (event.key === "i" && event.shiftKey && event.ctrlKey) {
            event.preventDefault();
            toggleConsole();
        }
    });

    // Execute JavaScript commands
    function executeCommand() {
        const command = consoleInput.value;
        if (command.trim() === "") return;
        consoleInput.value = "";
        const commandElement = document.createElement("div");
        commandElement.textContent = `> ${command}`;
        commandElement.style.color = "#9cdcfe";
        consoleOutput.appendChild(commandElement);
        try {
            const result = eval(command);
            if (result !== undefined) {
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    }

    consoleButton.onclick = executeCommand;
    consoleInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            executeCommand();
        }
    });

    // Override console log methods
    ["log", "warn", "error", "info"].forEach(function (method) {
        const original = console[method];
        console[method] = function (...args) {
            const message = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" ");
            const messageElement = document.createElement("div");
            messageElement.textContent = `[${method.toUpperCase()}] ${message}`;
            messageElement.style.color = method === "error" ? "red" : method === "warn" ? "orange" : "inherit";
            consoleOutput.appendChild(messageElement);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            original.apply(console, args);
        };
    });
});