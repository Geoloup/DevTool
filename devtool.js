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
        right: 10px;
        width: 250px;
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
        width: 250px;
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
        document.body.style.width =  window.innerWidth - 250
        document.body.style.maxWidth =  window.innerWidth - 250
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
            const result = eval(command);
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
    ["log", "warn", "error", "info"].forEach(function (method) {
        const original = console[method];
        console[method] = function (...args) {
            const filteredArgs = args.filter(arg => arg !== null && arg !== undefined && arg !== "");

            if (filteredArgs.length === 0) {
                return; // If no valid arguments, do nothing
            }
            const message = filteredArgs.map(arg => {
                if (arg instanceof Element) {
                    return '<pre class="element">' + arg.outerHTML.replaceAll('<','&lt;').replaceAll('>','&gt;') + '</pre>'; // Print element as HTML
                } else if (typeof arg === "object") {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return "[Error serializing object]";
                    }
                } else {
                    return String(arg).replaceAll('<','&lt;').replaceAll('>','&gt;');
                }
            }).join(" ");
            const messageElement = document.createElement("div");
            messageElement.innerHTML = `[${method.toUpperCase()}] ${message}`;
            messageElement.style.color = method === "error" ? "red" : method === "warn" ? "orange" : "inherit";
            consoleOutput.appendChild(messageElement);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            original.apply(console, args);
        };
    });
});