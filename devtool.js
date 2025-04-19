function showMessage(text, duration = 3000) {
    let messageBox = document.getElementById("messageBox");
    if (!messageBox) {
        messageBox = document.createElement("div");
        messageBox.id = "messageBox";
        document.body.appendChild(messageBox);

        Object.assign(messageBox.style, {
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1E3A5F", /* Dark Normal Blue */
            color: "white",
            padding: "15px 20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            display: "none",
            fontFamily: "Arial, sans-serif",
            zIndex: "1000"
        });
    }

    messageBox.textContent = text;
    messageBox.style.display = "block";
    setTimeout(() => {
        messageBox.style.display = "none";
    }, duration);
}

function devtoolFunction(event) {
    console.log(event.target.value)
}

function devtoolFunctionEnable(event) {
    event.target.disabled = false
}

function highlightHTML(html) {
    // Highlight anything that looks like a tag (e.g. &lt;tag&gt;)
    return html.replace(/(&lt;[^&]+?&gt;)/g, match => {
      return `<span class='element' style="color:#9f87e6; font-weight:bold;;margin:0px;">${match}</span>`;
    });
}  

function exec(jsCode) { 
    const blob = new Blob([jsCode], { type: "application/javascript" });
    const blobURL = URL.createObjectURL(blob);
    const script = document.createElement("script");
    script.src = blobURL;
    document.body.appendChild(script);
}

addEventListener("DOMContentLoaded", (event) => {
    function generateCustomUUID(prefix = 'd') {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let uuid = '';

        for (let i = 0; i < 32; i++) {
            uuid += chars[Math.floor(Math.random() * chars.length)];
        }

        return `${prefix}${uuid}`;
    }
    // devtool elements and top bar
    const devtool = document.createElement("div");
    const consoleToggle = document.createElement("div");
    const view = document.createElement("div");
    const topBar = document.createElement("div")
    const elementSelector = document.createElement("button");
    const elementSwitch = document.createElement("button");
    const consoleSwitch = document.createElement("button");
    const sourceSwitch = document.createElement("button");
    var devtoolId = generateCustomUUID()
    devtool.id = devtoolId
    devtool.classList.add('devtool')
    view.id = "view";
    topBar.id = "topBar"
    elementSelector.classList.add('selectElement')
    elementSelector.textContent = '🖱️' // emoji
    elementSwitch.classList.add('DevButton')
    sourceSwitch.classList.add('DevButton')
    consoleSwitch.classList.add('DevButton')
    consoleSwitch.textContent = "console"
    elementSwitch.textContent = "element"
    sourceSwitch.textContent = "source"
    // element view
    const elementView = document.createElement("div");
    elementView.id = "elementView"
    elementView.setAttribute('DevToolTabGeoloup', 'true')

    // console
    const consoleView = document.createElement("div");
    const consoleOutput = document.createElement("div");
    const consoleInputContainer = document.createElement("div");
    const consoleInput = document.createElement("textarea");
    consoleToggle.id = "consoleToggle";
    consoleOutput.id = "consoleOutput";
    consoleInput.id = "consoleCommand";
    consoleInput.setAttribute('autocomplete', 'off')
    consoleToggle.innerHTML = "≡";
    consoleView.setAttribute('DevToolTabGeoloup', 'true')

    // source
    const sourceView = document.createElement('div')
    const sourceFile = document.createElement('div')    
    const sourceContent = document.createElement('pre')
    sourceContent.classList.add('sourceContent')
    sourceFile.classList.add('sourcesFile')
    sourceView.classList.add('sourceView')
    sourceView.setAttribute('DevToolTabGeoloup', 'true')
    sourceContent.classList.add('sourceCode')

    // Add style to html
    var devtoolSize = 400
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
            padding:0px;
            margin:0px;
            cursor: move;
            z-index: 1000000000000000000;
            font-family: sans-serif;
        }

        #consoleCommand {
            resize:none;
            width:100%;
            font-size:1rem;
            height:20px;
        }

        #view {
            position: fixed;
            bottom: 0;
            right: 0;
            width: ${devtoolSize}px;
            max-height: calc(100vh);
            height: calc(100vh);
            background-color: #1e1e1e;
            color: #dcdcdc;
            font-family: monospace;
            font-size: 14px;
            display: none;
            flex-direction: column;
            border-top: 2px solid #333;
            z-index: 100000000;
        }

        div[devtooltabgeoloup] {
            position:absolute;
            top:20px;
            left:0px;
            z-index:100000000000000;
            width:400px;
            overflow:scroll;
            max-height: calc(100vh - 20px);
            display:none;
        }

        div[devtooltabgeoloup].show {
            display:block;
        }

        #consoleOutput {
            flex: 1;
            padding: 10px;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow:scroll;
            max-height: calc(100vh - 40px);
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
        pre {
            margin:0px;
        }
        .selectElement {
            padding:0px;
        }
        .selectElement.selected {
            padding:0px;
            background:gray;
        }
        #topBar {
            position:fixed;
            top:0px;
            right:0px;
            width:${devtoolSize}px;
            height:20px;
            background:rgb(255,255,255,0.5)
        }
        
        .DevButton {
            background:none;
            border:none;
            border-bottom:solid 1px blue;
        }
        .DevButton.showed {
            background:none;
            border:none;
            border-bottom:solid 1px blue;
        }
        .element {  
            font-family: monospace;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 4px;
            border:none;
            border-radius: 2px;
            width:100%;
            white-space: pre;
            font-size:10px;
            display: inline-block;
        }

        .nestedCount {
            background-color: #3c3c3c;
            color: #cccccc;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 12px;
            margin-left: 6px;
            vertical-align: middle;
            font-weight: bold;
            display: inline-block;
        }
        
        .log {

        }

        .error {
            background:#df4c4c;
        }

        .info {
            background:#dddf4c;
        }

        .warn {
            background:orange;
        }

        .sourcesFile {
            display:flex;
            width:${devtoolSize/4}px;
            flex-direction: column;
            overflow:hidden;
            height:100%;
            border-right:2px solid black;
        }
        
        .sourceView {
            display:flex;
            flex-direction: row;
            width:${devtoolSize}px;
            overflow:scroll;
            height:100%;
        }
        
        .sourceButton {
            font-size:1rem;
            border:1px solid black;
            width:${devtoolSize/4}px;
            overflow:hidden;
            height:1.25rem;
            text-overflow: ellipsis;
        }
        .sourceContent {
            width:${devtoolSize - devtoolSize/4 - 2}px;
            overflow:scroll;
            height:100%;
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
    // join devtool content
    devtool.appendChild(consoleToggle);
    document.head.appendChild(style)
    devtool.appendChild(view);

    // append element to the vieww
    topBar.appendChild(elementSelector)
    topBar.appendChild(elementSwitch)
    topBar.appendChild(consoleSwitch)
    topBar.appendChild(sourceSwitch)
    view.appendChild(topBar)
    view.appendChild(elementView)
    view.appendChild(consoleView)
    view.appendChild(sourceView)

    consoleView.appendChild(consoleOutput);
    consoleView.appendChild(consoleInputContainer);
    consoleInputContainer.appendChild(consoleInput);

    sourceView.appendChild(sourceFile)
    sourceView.appendChild(sourceContent)

    document.documentElement.appendChild(devtool)

    // toggle tabs
    function switchTab(event) {
        var target = event.target
        var text = target.innerHTML
        var tabs = view.querySelectorAll('div[DevToolTabGeoloup]')
        for (const tab of tabs) {
            tab.classList.remove('show')
        }
        switch (text) {
            case 'element':
                elementView.classList.add('show')
                break;
            case 'console':
                consoleView.classList.add('show')
                break;
            case 'source':
                sourceView.classList.add('show')
                break;
    
            default:
                break;
        }
    }

    consoleSwitch.onclick = switchTab
    elementSwitch.onclick = switchTab
    sourceSwitch.onclick = switchTab

    // Toggle console visibility
    function toggleConsole() {
        const state = window.devtool
        if (state) {
            localStorage.setItem('devtoolOpen&url=' + location.origin, true)
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 'width=' + String(window.innerWidth - devtoolSize) + ', initial-scale=1.0');
            } else {
                const newMeta = document.createElement('meta');
                newMeta.setAttribute('name', 'viewport');
                newMeta.setAttribute('content', 'width=' + String(window.innerWidth - devtoolSize) + ', initial-scale=1.0');
                document.head.appendChild(newMeta);
            }
        } else {
            localStorage.setItem('devtoolOpen&url=' + location.origin, false)
            const viewportMeta = document.querySelector('meta[name="viewport"]');
        }
        view.style.display = view.style.display === "none" ? "flex" : "none";
        window.devtool = window.devtool ? false : true
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
            const result = exec(command); // Directly execute command
            console.log(result); // Log the result
        } catch (error) {
            console.error(error);
        }
    }
    consoleInput.addEventListener("keyup", () => {
        consoleInput.style.height = calcHeight(consoleInput.value) + "px";
        consoleView.scrollTop = consoleView.scrollHeight
    });
    consoleInput.addEventListener("input", () => {
        consoleInput.style.height = calcHeight(consoleInput.value) + "px";
        consoleView.scrollTop = consoleView.scrollHeight
    });

    consoleInput.addEventListener("keypress", function (event) {
        consoleInput.style.height = calcHeight(consoleInput.value) + "px";
        consoleView.scrollTop = consoleView.scrollHeight
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

    addEventListener("error", (event) => {
        var message = `${event.error ? event.error.stack : "N/A"}` // \n at ${event.filename} ${event.lineno}:${event.colno}        
        console.error(message)
        try {
            if (file.startsWith('blob')) {
                fetch (file)
                .then(x => x.text())
                .then((res) => {
                    var tab = document.createElement('button')
                    tab.classList.add('sourceButton')
                    tab.innerText = res
                    tab.onclick = (event) => {
                        sourceContent.innerText = res                    
                    }
                    sourceFile.appendChild(tab)
                });   
            } else {
                fetch ("https://api.codetabs.com/v1/proxy?quest=" + file)
                .then(x => x.text())
                .then((res) => {
                    var tab = document.createElement('button')
                    tab.classList.add('sourceButton')
                    tab.innerText = res
                    tab.onclick = (event) => {
                        sourceContent.innerText = res                    
                    }
                    sourceFile.appendChild(tab)
                });    
            }
        } catch (err){
            showMessage('fail ' + err.message)
        }
    });

    ["log", "warn", "error", "info"].forEach(function (method) {
        const original = console[method];
        console[method] = function (...args) {
            const filteredArgs = args.length > 0 ? args : ["undefined"];
            var message = filteredArgs.map(arg => formatLog(arg, 0)).join(" ");
            appendToConsoleOutput(method.toUpperCase(), message);
            original.apply(console, args);
        };
    });
    function sanitizeHTML(html) {
        var html = html.replaceAll('\n', '<br>')
        const allowedTags = new Set(["pre", "p", "details", "summary", "span", "img", "a","br"]);
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
        return sanitizeHTML(String(arg)); // sanitize the string and html
    }

    function createBetterArray(array, depth) {
        return `<details><summary style="margin-left:${depth * 8 + 8}px">[Array(${array.length})]</summary><pre style="margin-left:${depth * 8 + 8}px">${array.map(v => formatLog(v, depth + 1)).join("\n")}</pre></details>`;
    }

    function createInspectableObject(obj, depth) {
        return `<details><summary style="margin-left:${depth * 8 + 8}px">${obj.constructor.name || "Object"}</summary><pre style="margin-left:${depth * 8 + 8}px">${Object.entries(obj).map(([k, v]) => `${k}: ${formatLog(v, depth + 1)}`).join("\n")}</pre></details>`;
    }

    function createInspectableElement(element, depth) {
        let attributes = Array.from(element.attributes)
            .map(attr => `${attr.name}="${attr.value}"`)
            .join(" ");
        let tagOpen = `&lt;${element.tagName.toLowerCase()}${attributes ? ' ' + attributes : ''}&gt;`;
        if (!element.children.length || depth >= 10) return `<summary style="margin-left:${8 + depth * 8}px;">${tagOpen}</summary>`;
        return `<details><summary style="margin-left:${8 + depth * 8}px;">${tagOpen}</summary>${Array.from(element.children).map(child => createInspectableElement(child, depth + 1)).join('')}</details>`;
    }

    function appendToConsoleOutput(type, message) {
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `${message}`;
        messageElement.style.color = 'white';
        messageElement.classList.add(type.toLowerCase())
        consoleOutput.appendChild(messageElement);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    const getColor = method => ({ error: "red", warn: "orange" }[method] || "inherit");


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
        var viewer = document.createElement('div')
        var overlay = document.createElement('div')
        document.documentElement.appendChild(viewer)
        document.body.appendChild(overlay)
        viewer.style.position = 'fixed'
        viewer.style.zIndex = 100000
        viewer.style.background = "white"
        viewer.style.borderRadius = "10px"
        viewer.style.padding = "10px"
        overlay.style.position = 'fixed'
        overlay.style.zIndex = 100000
        overlay.style.background = 'white'
        overlay.style.opacity = "0"
        overlay.style.display = "block"
        overlay.style.left = "0px"
        overlay.style.top = "0px"
        overlay.style.width = "calc(100vw - 250px)"
        overlay.style.height = "100vh"
        overlay.style.cursor = "default"
        overlay.style.userSelect = "none"
        function stopSeletion() {
            document.body.removeEventListener("mousemove", mouseMoveHandler);
            document.body.removeEventListener("click", clickHandler2);
            devtool.removeEventListener("mousemove", mousehandle);
            overlay.remove()
            viewer.remove()
            elementSelector.onclick = startSelection
        }
        elementSelector.onclick = stopSeletion
        var lastEv = undefined
        var lastB = undefined
        const mouseMoveHandler = (event) => {
            viewer.style.display = "block"
            viewer.style.left = String(event.clientX + 10) + 'px'
            viewer.style.top = String(event.clientY + 10) + 'px'
            var target = document.elementsFromPoint(event.clientX, event.clientY)[1]
            if (lastEv) {
                lastEv.style.border = lastB
            }
            lastB = target.style.border
            lastEv = target
            target.style.border = "1px solid blue !important"
            var info = target.outerHTML.replace(target.innerHTML, "").trim();
            // info.replaceAll('<','&lt;').replaceAll('>','&gt;')
            if (target.id.length > 50) {
                viewer.innerHTML = `<span style="padding:5px;margin:0x;color:blue;">${target.tagName}#${target.id}.${target.classList.value.replaceAll(' ', '.')}</span><div><span>X: ${event.clientX}<br>Y: ${event.clientY}</span></div>`
            } else {
                viewer.innerHTML = `<span style="padding:5px;margin:0x;color:blue;">${target.tagName}.${target.classList.value.replaceAll(' ', '.')}</span><br><span style="">ID: ${target.id}</span><br><div><span>X: ${event.clientX}<br>Y: ${event.clientY}</span></div>`
            }
            // target.outerHTML.replaceAll('<','<p class="element">&lt;').replaceAll('>','</p>&gt;')
        };

        const mousehandle = (event) => {
            viewer.style.display = "none" // hide it
        };
        const clickHandler2 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (lastEv) {
                lastEv.style.border = lastB
            }
            var target = document.elementsFromPoint(event.clientX, event.clientY)[1]
            console.log("devtool.last() to get more | Clicked element:", target); // send to console element from the selector for inspection
            window.devToolLastClick = event.target
            document.body.removeEventListener("mousemove", mouseMoveHandler);
            document.body.removeEventListener("click", clickHandler2);
            devtool.removeEventListener("mousemove", mousehandle);
            overlay.remove()
            viewer.remove()
        };

        document.body.addEventListener("mousemove", mouseMoveHandler);
        viewer.addEventListener("mousemove", mouseMoveHandler);
        document.body.addEventListener("click", clickHandler2);
        devtool.addEventListener("mousemove", mousehandle);
    }
    elementSelector.onclick = startSelection

    // element view    
    function createTree(root, previousOpen = new Map()) {
        const html = [];
        const stack = [{ el: root, depth: 0 }];
        const lastOfType = new Map();
        const repeatedMap = new Map();
    
        // First pass: track last element per tag type and count repeated text content
        const queue = [{ el: root, depth: 0 }];
        for (let i = 0; i < queue.length; i++) {
            const { el, depth } = queue[i];
            if (depth >= 10) continue;
    
            const tag = el.tagName.toLowerCase();
            lastOfType.set(tag, el);
    
            const text = el.textContent.trim();
            if (text) {
                const key = `${tag}|${text}`;
                repeatedMap.set(key, (repeatedMap.get(key) || 0) + 1);
            }
    
            const children = el.children;
            for (let j = 0; j < children.length; j++) {
                queue.push({ el: children[j], depth: depth + 1 });
            }
        }
    
        // Track how many times we've seen each tag+text combo (for rendering xN only once)
        const renderedRepeats = new Map();
    
        // Build HTML
        var lastEl = ''
        var lastC = 0
        while (stack.length) {
            const { el, depth } = stack.pop();
            const tag = el.tagName.toLowerCase();
            const indent = 8 + depth * 8;
            const attrs = el.hasAttributes() ? [...el.attributes].map(a => `${a.name}="${a.value}"`).join(" ") : "";
            const tagOpen = `&lt;${tag.replaceAll('&','&amp;')}${(attrs ? " " + attrs : "").replaceAll('&','&amp;')}&gt;`.replaceAll('"','&quot;').replaceAll("'",'&apos');
            const children = el.children;
            const text = el.textContent.trim();
            const key = `${tag}|${text}`;

            if (tagOpen == lastEl) {
                lastC++
            } else if (lastC != 0){
                const line = `<span class='nestedCount' >x${String(lastC)}</span><input disabled oninput="devtoolFunction()" onclick="devtoolFunctionEnable()" class="element nested" style="margin-left:${indent}px; value="${tagOpen}">`;
                html.push(line);
                lastC = 0
            } else {
                const line = `<input disabled oninput="devtoolFunction()" onclick="devtoolFunctionEnable()" class="element" style="margin-left:${indent}px;" value="${tagOpen}">`;
                html.push(line);
                lastC = 0
            }

            lastEl = tagOpen
    
            if (children.length && depth < 10) {
                for (let i = children.length - 1; i >= 0; i--) {
                    stack.push({ el: children[i], depth: depth + 1 });
                }
            }
        }
    
        return html.join('');
    }

    let lastOpen = new Map();
    const treeHTML = createTree(document.body, lastOpen);

    function updateTreeView() {
        lastOpen = new Map();
        document.querySelectorAll("#tree details[open]").forEach(d => {
            const tag = d.querySelector("summary")?.textContent?.match(/^<(\w+)/)?.[1];
            if (tag) lastOpen.set(tag, d);
        });
        elementView.innerHTML = (createTree(document.body,lastOpen))
    }
    const targetNode = document.body;
    var updateList = []
    function TreeUpdate() {
        if (updateList.length == 0 || updateList.length == 1) {
            return;
        }
        var lval = updateList.length > 4 ? 10 : updateList.length
        for (let i = 0; i < lval; i++) {
            updateList.pop()
        }
        updateTreeView()
    }

    setInterval(TreeUpdate,100)
    const config = { childList: true, subtree: true, attributes: true};
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            const target = mutation.target;
            if (!devtool.contains(target)) {
                updateList.push(updateTreeView)
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    if (localStorage.getItem('devtoolOpen&url=' + location.origin) == 'true') {
        toggleConsole()
    }
    toggleConsole() // bug fix for the rest

    function addSource(file) {
        if (isURL(file)) {} else {
            var file = location.origin + '/' + file
        }
        try {
            fetch (file)
            .then(x => x.text())
            .then((res) => {
                var tab = document.createElement('button')
                tab.classList.add('sourceButton')
                tab.innerText = file.split('/')[file.split('/').length-1]
                tab.onclick = (event) => {
                    sourceContent.innerText = res                    
                }
                sourceFile.appendChild(tab)
            });
        } catch {
            try {
                fetch ("https://api.codetabs.com/v1/proxy?quest=" + file)
                .then(x => x.text())
                .then((res) => {
                    var tab = document.createElement('button')
                    tab.classList.add('sourceButton')
                    tab.innerText = file.split('/')[file.split('/').length-1]
                    tab.onclick = (event) => {
                        sourceContent.innerText = res                    
                    }
                    sourceFile.appendChild(tab)
                });    
            } catch {}
        }
    }
    function isURL(str) {
        const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?$/i;
        return pattern.test(str);
    }
    function genSource(p1) {
        var filename = p1.split('/')[p1.split('/').length-1]
        var filename = filename.split('.')[filename.split('.').length-1]
        var etxs = ['png','jpeg','gif']
        console.log(filename)
        if (isURL(p1)) {
            addSource(p1)
        } else {
            addSource(location.origin + '/' + p1)
        }
    }

    function populateSource() {
        var body = document.body.innerHTML
        var head = document.head.innerHTML
        body.replace(/["' ]src=["']([^"']+)["']/g,(match,p1)=> {
            genSource(p1)
        })
        body.replace(/["' ]href=["']([^"']+)["']/g,(match,p1)=> {
            genSource(p1)
        })
        head.replace(/["' ]src=["']([^"']+)["']/g,(match,p1)=> {
            genSource(p1)
        })
        head.replace(/["' ]href=["']([^"']+)["']/g,(match,p1)=> {
            genSource(p1)
        })
    }
    setTimeout(() => {
        populateSource()               
    }, 1000);
});
