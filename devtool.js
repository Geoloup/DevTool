function generateCustomUUID(prefix = 'd') {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uuid = '';
    
    for (let i = 0; i < 32; i++) {
        uuid += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return `${prefix}${uuid}`;
}

addEventListener("DOMContentLoaded", (event) => {
    // Create console elements
    const devtool = document.createElement("div");
    const consoleToggle = document.createElement("div");
    const customConsole = document.createElement("div");
    const consoleOutput = document.createElement("div");
    const consoleInputContainer = document.createElement("div");
    const consoleInput = document.createElement("textarea");

    // Set element IDs
    var devtoolId = generateCustomUUID('d')
    devtool.id = devtoolId
    devtool.class = "devtool"
    consoleToggle.id = "consoleToggle";
    customConsole.id = "customConsole";
    consoleOutput.id = "consoleOutput";
    consoleInput.id = "consoleCommand";
    consoleInput.setAttribute('autocomplete', 'off')
    // Add styles dynamically
    const style = document.createElement("style");
    var css = `
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

    #consoleCommand {
        resize:none;
        width:100%;
        font-size:1rem;
        height:20px;
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
    summary.element {
        white-space: preserve nowrap;;
        word-wrap: keep-all;
    }
    #consoleCommand {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
        background-color: #2d2d2d;
        color: #dcdcdc;
    }
    pre.element {
        max-height:6rem;
        font-size:1rem;
        overflow:scroll;
    }
`;
    style.innerHTML = css.replace(/([^\n]*{)/g,`#${devtoolId} $1`) // add devtool to be sure
    function resizeBody() {
        if (!window.devtool) { return; }
        // Set body's width and height based on window size minus 250px from width
        document.body.style.width = (window.innerWidth - 250) + "px";
        document.body.style.height = window.innerHeight + "px";
    }

    // Run on page load
    resizeBody();

    // Update on window resize
    window.addEventListener("resize", resizeBody);
    devtool.appendChild(style);
    devtool.appendChild(consoleToggle);
    devtool.appendChild(customConsole);
    customConsole.appendChild(consoleOutput);
    customConsole.appendChild(consoleInputContainer);
    consoleInputContainer.appendChild(consoleInput);
    document.documentElement.appendChild(devtool)

    consoleToggle.innerHTML = "≡";

    // Toggle console visibility
    function toggleConsole() {
        window.devtool = window.devtool ? false : true
        // Adjusting the viewport width dynamically
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=' + window.innerWidth-250 + ', initial-scale=1.0');
        } else {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('name', 'viewport');
            newMeta.setAttribute('content', 'width=' + window.innerWidth-250 + ', initial-scale=1.0');
            document.head.appendChild(newMeta);
        }
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
        if (event.key.toLowerCase() === "i" && event.shiftKey && event.ctrlKey) {
            event.preventDefault();
            toggleConsole();
        }
    });

    // Execute JavaScript commands
    function executeCommand() {
        const command = consoleInput.value;
        consoleInput.value = "";
        if (command.trim() === "") return;

        const commandElement = document.createElement("div");
        commandElement.textContent = `> ${command}`;
        commandElement.style.color = "#9cdcfe";
        consoleOutput.appendChild(commandElement);

        try {
            const result = eval(command); // Directly execute command
            console.log(result); // Log the result
        } catch (error) {
            console.error(error);
        }
    }
    consoleInput.addEventListener("keyup", () => {
        consoleInput.style.height = calcHeight(consoleInput.value) + "px";
    });

    consoleInput.addEventListener("keypress", function (event) {
        consoleInput.style.height = calcHeight(consoleInput.value) + "px";
        if (event.key === "Enter" && !event.shiftKey) {
            try {
                event.preventDefault()
            } catch {}
            executeCommand();   
            consoleInput.style.height = calcHeight(consoleInput.value) + "px";
        }
    });
    function calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
        return newHeight;
    }

    // Override console log methods
    addEventListener("error", (event) => {
        const message = formatLog(event.message, 0)
        console.error(event.type + message);
    });

    ["log", "warn", "error", "info"].forEach(function (method) {
        const original = console[method];
        console[method] = function (...args) {
            const filteredArgs = args.length > 0 ? args : ["undefined"];
            const message = filteredArgs.map(arg => formatLog(arg, 0)).join(" ");

            appendToConsoleOutput(method.toUpperCase(), message, getColor(method));
            original.apply(console, args);
        };
    });

    function formatLog(arg, depth) {
        if (depth > 5) return "[Max depth reached]";
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (Array.isArray(arg)) return `[Array(${arg.length})] ` + JSON.stringify(arg, null, 2);
        if (arg instanceof Element) return createInspectableElement(arg, depth);
        if (typeof arg === "function") return `[Function: ${arg.name || "anonymous"}]`;
        if (typeof arg === "object") return createInspectableObject(arg, depth);
        return String(arg).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }

    function createInspectableObject(obj, depth) {
        const wrapper = document.createElement("details");
        wrapper.open = false
        const summary = document.createElement("summary");
        summary.textContent = obj.constructor.name || "Object";
        wrapper.appendChild(summary);

        const content = document.createElement("pre");
        content.textContent = Object.entries(obj)
            .map(([key, value]) => {
                if (typeof value === 'object') return `${key}: ${formatLog(value, depth + 1)}`;
                if (typeof value === 'function') return `${key}: [Function: ${value.name || "anonymous"}]`;
                return `${key}: ${value}`;
            })
            .join("\n");
        wrapper.appendChild(content);

        return wrapper.outerHTML;
    }

    function createInspectableElement(element, depth) {

        // Show the element's tag, class, and id in the summary
        const info = element.outerHTML.split('<').join('').split('>')[0] // select elment
        if (Array.from(element.children).length == 0) {
            const wrapper = document.createElement("span"); // fake wrapper
            wrapper.style.marginLeft = String(depth*4) + 'px'
            wrapper.innerHTML = `&lt;${info}&gt;`;
            return wrapper.outerHTML; // summary
        }
        const wrapper = document.createElement("details");
        wrapper.open = false; // Elements collapsed by default
        const summary = document.createElement("summary");
        summary.style.marginLeft = String(depth*4) + 'px'
        summary.innerHTML = `&lt;${info}&gt;`;
        wrapper.appendChild(summary);
        // if at the end of childrent stop inspectable element

        // If max depth is reached, show a message and don't expand further
        if (depth >= 10) {
            const content = document.createElement("pre");
            content.textContent = "[Max depth reached]";
            wrapper.appendChild(content);
            return wrapper.outerHTML;
        }

        // Process and show direct children only
        Array.from(element.children).forEach(child => {
            const childWrapper = document.createElement("div");
            childWrapper.innerHTML = createInspectableElement(child, depth + 1);
            wrapper.appendChild(childWrapper);
        });

        return wrapper.outerHTML;
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