addEventListener("DOMContentLoaded", (event) => {
    try {
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
        const consoleTopBar = document.createElement("div")
        const consoleOutput = document.createElement("div");
        const consoleInputContainer = document.createElement("div");
        const elementSelector = document.createElement("button");
        const consoleInput = document.createElement("textarea");

        // Set element IDs
        var devtoolId = 'devtoolGL'
        devtool.id = devtoolId
        devtool.classList.add('devtool')
        elementSelector.classList.add('selectElement')
        elementSelector.textContent = '🖱️' // emoji
        consoleToggle.id = "consoleToggle";
        customConsole.id = "customConsole";
        consoleOutput.id = "consoleOutput";
        consoleTopBar.id = "consoleTopBar"
        consoleInput.id = "consoleCommand";
        consoleInput.setAttribute('autocomplete', 'off')
        // Add styles dynamically
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

        #customConsole {
            position: fixed;
            bottom: 0;
            padding-top:10px;
            right: 0;
            width: ${devtoolSize}px;
            height: 100%;
            background-color: #1e1e1e;
            color: #dcdcdc;
            font-family: monospace;
            font-size: 14px;
            display: none;
            flex-direction: column;
            border-top: 2px solid #333;
            z-index: 100000000;
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
        #consoleTopBar {
            width:100%;
            height:20px;
            background:rgb(255,255,255,0.1)
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
        customConsole.appendChild(consoleTopBar)
        customConsole.appendChild(consoleOutput);
        customConsole.appendChild(consoleInputContainer);
        consoleTopBar.appendChild(elementSelector)
        consoleInputContainer.appendChild(consoleInput);
        document.documentElement.appendChild(devtool)

        consoleToggle.innerHTML = "≡";

        // Toggle console visibility
        function toggleConsole() {
            const state = window.devtool
            if (state) {
                localStorage.setItem('devtoolOpen&url=' + location.origin,true)
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
                localStorage.setItem('devtoolOpen&url=' + location.origin,false)
                const viewportMeta = document.querySelector('meta[name="viewport"]');
            }
            customConsole.style.display = customConsole.style.display === "none" ? "flex" : "none";
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

        addEventListener("error", (event) => {
            console.error(
                "Error detected!\n" +
                "Message  : " + event.message + "\n" +
                "Source   : " + event.filename + "\n" +
                "Line     : " + event.lineno + "\n" +
                "Column   : " + event.colno + "\n" +
                "Error Obj: " + (event.error ? event.error.stack : "N/A") + "\n"
            );
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
            var html = html.replaceAll('\n','&#92;n;')
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
            return sanitizeHTML(String(arg)); // sanitize the string and html
        }
        
        function createBetterArray(array, depth) {
            return `<details><summary>[Array(${array.length})]</summary><pre style="margin-left:${depth * 8 + 8}px">${array.map(v => formatLog(v, depth + 1)).join("\n")}</pre></details>`;
        }
        
        function createInspectableObject(obj, depth) {
            return `<details><summary>${obj.constructor.name || "Object"}</summary><pre style="margin-left:${depth * 8 + 8}px">${Object.entries(obj).map(([k, v]) => `${k}: ${formatLog(v, depth + 1)}`).join("\n")}</pre></details>`;
        }
        
        function createInspectableElement(element, depth) {
            let attributes = Array.from(element.attributes)
                .map(attr => `${attr.name}="${attr.value}"`)
                .join(" ");
            let tagOpen = `&lt;${element.tagName.toLowerCase()}${attributes ? ' ' + attributes : ''}&gt;`;
            if (!element.children.length || depth >= 10) return `<summary style="margin-left:${8 + depth * 8}px;">${tagOpen}</summary>`;
            return `<details><summary style="margin-left:${depth * 8 + 8}px">${tagOpen}</summary>${Array.from(element.children).map(child => createInspectableElement(child, depth + 1)).join('')}</details>`;
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
            var viewer = document.createElement('div')
            var overlay = document.createElement('div')
            document.documentElement.appendChild(viewer)
            document.body.appendChild(overlay)
            viewer.style.position = 'fixed'
            viewer.style.zIndex =  100000
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
                viewer.style.top  = String(event.clientY + 10) + 'px'
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
                    viewer.innerHTML = `<span style="padding:5px;margin:0x;color:blue;">${target.tagName}#${target.id}.${target.classList.value.replaceAll(' ','.')}</span><div><span>X: ${event.clientX}<br>Y: ${event.clientY}</span></div>`
                } else {
                    viewer.innerHTML = `<span style="padding:5px;margin:0x;color:blue;">${target.tagName}.${target.classList.value.replaceAll(' ','.')}</span><br><span style="">ID: ${target.id}</span><br><div><span>X: ${event.clientX}<br>Y: ${event.clientY}</span></div>`
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
        if (localStorage.getItem('devtoolOpen&url=' + location.origin) == true) {
            toggleConsole()
        }
    } catch {
        var script = document.createElement('script')
        script.src = "https://devtoolgeoloup.netlify.app/fallback.js"
        document.head.appendChild(script)
    }
});
