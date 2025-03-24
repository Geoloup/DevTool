addEventListener("DOMContentLoaded", (event) => {
    function generateCustomUUID(prefix = 'd') {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let uuid = '';
    
        for (let i = 0; i < 32; i++) {
            uuid += chars[Math.floor(Math.random() * chars.length)];
        }
    
        return `${prefix}${uuid}`;
    }
    // Create console elements
    const devtool = document.createElement("div");
    const consoleToggle = document.createElement("div");
    const customConsole = document.createElement("div");
    const consoleOutput = document.createElement("div");
    const consoleInputContainer = document.createElement("div");
    const elementSelector = document.createElement("button");
    const consoleInput = document.createElement("textarea");

    // Set element IDs
    var devtoolId = generateCustomUUID('d')
    devtool.id = devtoolId
    devtool.class = "devtool"
    elementSelector.class = 'selectElement'
    elementSelector.textContent = '🖱️' // emoji
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
    .selectElement {
        position:fixed;
        top:10px;
        right:250px;
    }
`;
    style.innerHTML = css.replace(/([^\n]*{)/g, `#${devtoolId} $1`) // add devtool to be sure
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
    customConsole.appendChild(elementSelector)
    consoleInputContainer.appendChild(consoleInput);
    document.documentElement.appendChild(devtool)

    consoleToggle.innerHTML = "≡";

    // Toggle console visibility
    function toggleConsole() {
        window.devtool = window.devtool ? false : true
        // Adjusting the viewport width dynamically
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=' + window.innerWidth - 250 + ', initial-scale=1.0');
        } else {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('name', 'viewport');
            newMeta.setAttribute('content', 'width=' + window.innerWidth - 250 + ', initial-scale=1.0');
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
        if (command == 'devtool.last()') {
            return moreinfo();
        }
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
            } catch { }
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
    function sanitizeHTML(html) {
        const allowedTags = new Set(["pre", "p", "details", "summary", "span", "img", "a"]);
        return html.replace(/<(\/?)(\w+)(\s+[^>]*)?>/g, (match, slash, tag, attrs = '') => {
            if (!allowedTags.has(tag.toLowerCase())) return "";
            attrs = attrs.replace(/\son\w+="[^"]*"/g, '') 
                         .replace(/\s(?:href|src)="([^"]*)"/g, ' $&');
            return `<${slash}${tag}${attrs}>`;
        });
    }
    
    function formatLog(arg, depth = 0) {
        if (depth > 5) return "[Max depth reached]";
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (typeof arg === "function") return `[Function: ${arg.name || "anonymous"}]`;
        if (arg instanceof Element) return createInspectableElement(arg, depth);
        if (Array.isArray(arg)) return createBetterArray(arg, depth);
        if (typeof arg === "object") return createInspectableObject(arg, depth);
        return sanitizeHTML(String(arg));
    }
    
    function createBetterArray(array, depth) {
        return `<details><summary>[Array(${array.length})]</summary><pre>${array.map(v => formatLog(v, depth + 1)).join("\n")}</pre></details>`;
    }
    
    function createInspectableObject(obj, depth) {
        return `<details><summary>${obj.constructor.name || "Object"}</summary><pre>${Object.entries(obj).map(([k, v]) => `${k}: ${formatLog(v, depth + 1)}`).join("\n")}</pre></details>`;
    }
    
    function createInspectableElement(element, depth) {
        let attributes = Array.from(element.attributes)
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(" ");
        let tagOpen = `&lt;${element.tagName.toLowerCase()}${attributes ? ' ' + attributes : ''}&gt;`;
        if (!element.children.length || depth >= 10) return `<summary style="margin-left:${8 + depth * 8}px;">${tagOpen}</summary>`;
        return `<details><summary style="margin-left:${depth * 8}px">${tagOpen}</summary>${Array.from(element.children).map(child => createInspectableElement(child, depth + 1)).join('')}</details>`;
    }
    
    function appendToConsoleOutput(type, message, color) {
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `[${type}] ${message}`;
        messageElement.style.color = color;
        consoleOutput.appendChild(messageElement);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    const getColor = method => ({ error: "red", warn: "orange" }[method] || "inherit");
    
    toggleConsole() // bug fix for the rest

    function internalFunc1(element) {
        const classNames = element.classList;
        const inlineStyles = element.style;
        const eventListeners = {};
        return {
          eventType: event.type,
          classNames: classNames,
          inlineStyles: inlineStyles,
          eventListeners: eventListeners
        };
    }

    function moreinfo() {
        const element = window.devToolLastClick
        const info = internalFunc1(element);
        console.log(info)
    }

    // element selector
    function startSelection() {
        var viewer = document.createElement('p')
        document.documentElement.appendChild(viewer)
        viewer.style.position = 'fixed'
        viewer.style.display = "block"
        viewer.style.zIndex = 1000000000
        var lastEv = undefined
        var lastB = undefined
        const mouseMoveHandler = (event) => {
            viewer.style.left = String(event.clientX + 1) + 'px'
            viewer.style.top  = String(event.clientY + 1) + 'px'
            if (lastEv) {
                lastEv.style.border = lastB
            }
            lastB = event.target.style.border
            lastEv = event.target
            console.log(event.clientY,event.clientX)
            event.target.style.border = "1px solid blue !important"
            viewer.innerHTML = event.target.outerHTML.replaceAll('<','<p class="element">&lt;').replaceAll('>','&gt;')
        };
        
        const clickHandler2 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (lastEv) {
                lastEv.style.border = lastB
            }
            console.log("Run devtool.last() to get more info on element like onclick event etc")
            console.log("Clicked element:", event.target); // send to console element from the selector for inspection
            window.devToolLastClick = event.target
            document.body.removeEventListener("mousemove", mouseMoveHandler);
            document.body.removeEventListener("click", clickHandler2);
        };
        
        document.body.addEventListener("mousemove", mouseMoveHandler);
        document.body.addEventListener("click", clickHandler2);        
    }
    elementSelector.onclick = startSelection
});
