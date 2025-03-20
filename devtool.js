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
    consoleInput.setAttribute('autocomplete', 'off')
    consoleButton.innerText = "Run";
    // Add styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
    #consoleToggle {
        position: fixed;
        bottom: 20px;
        right: 10px;
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
        right: 0;
        width: 400px;
        height: 100%;
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
    pre.element {
        max-height:6rem;
        font-size:1rem;
        overflow:scroll;
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
        resizeTo(window.outerWidth - 400, window.outerHeight)
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
        if (event.code === "i".charCodeAt(0) && event.shiftKey && event.ctrlKey) {
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
            const result = eval('console.log(' + command + ')');
            console.log(result);
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
    addEventListener("error", (event) => {
        const filteredArgs = event.message ? [event.message] : [];

        if (filteredArgs.length === 0) {
            return; // If no valid arguments, do nothing
        }
        const message = filteredArgs.map(formatLog).join(" ");
        appendToConsoleOutput("Error", message, "red");
    });

    ["log", "warn", "error", "info"].forEach(function (method) {
        const original = console[method];
        console[method] = function (...args) {
            const filteredArgs = args.length > 0 ? args : ["undefined"];
            const message = filteredArgs.map(formatLog).join(" ");

            appendToConsoleOutput(method.toUpperCase(), message, getColor(method));
            original.apply(console, args);
        };
    });

    function formatLog(arg) {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (Array.isArray(arg)) return JSON.stringify(arg, null, 2);
        if (arg instanceof Element) {
            return '<pre class="element">' + arg.outerHTML.replaceAll('<', '&lt;').replaceAll('>', '&gt;') + '</pre>';
        }
        if (typeof arg === "object") {
            try {
                return JSON.stringify(arg, null, 2);
            } catch (e) {
                return "[Error serializing object]";
            }
        }
        return String(arg).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }

    function appendToConsoleOutput(type, message, color) {
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `[${type}] ${message}`;
        messageElement.style.color = color;
        consoleOutput.appendChild(messageElement);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function getColor(method) {
        return method === "error" ? "red" : method === "warn" ? "orange" : "inherit";
    }
});