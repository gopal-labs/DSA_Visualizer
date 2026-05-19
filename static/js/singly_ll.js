const svg = document.getElementById('llSvg');
const statusMsg = document.getElementById('statusMsg');
const nodeValInput = document.getElementById('nodeVal');
const nodeIdxInput = document.getElementById('nodeIdx');

const NODE_W = 72;
const NODE_H = 48;
const ARROW_LEN = 50;
const GAP = ARROW_LEN;
const START_X = 40;
const Y = 90;

const COLORS = {
    node: '#4895ef',
    highlight: '#f72585',
    text: '#f0f0f0',
    pointer: '#4cc9f0',
    null_text: '#6b7280',
    bg: 'none',
};

let ll = [10, 20, 30, 40];
let highlightIdx = -1;

function setStatus(msg) { statusMsg.textContent = msg; }

function render() {
    const totalW = ll.length * (NODE_W + GAP) + GAP + START_X + 80;
    svg.setAttribute('viewBox', `0 0 ${Math.max(totalW, 400)} 180`);
    svg.setAttribute('width', Math.max(totalW, 400));

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    if (ll.length === 0) {
        const t = makeSvgEl('text', { x: 150, y: 100, fill: COLORS.null_text, 'font-size': '16', 'font-weight': 'bold', 'font-family': 'Arial' });
        t.textContent = 'Empty Linked List [NULL]';
        svg.appendChild(t);
        return;
    }

    const labelY = Y - 30;

    ll.forEach((val, i) => {
        const x = START_X + i * (NODE_W + GAP);
        const isActive = i === highlightIdx;
        const fill = isActive ? COLORS.highlight : COLORS.node;

        // Node rect
        const rect = makeSvgEl('rect', {
            x, y: Y, width: NODE_W, height: NODE_H,
            rx: 5, fill, stroke: isActive ? '#fff' : '#1e90ff', 'stroke-width': isActive ? 2.5 : 1.5,
        });
        svg.appendChild(rect);

        // Value text
        const vt = makeSvgEl('text', {
            x: x + NODE_W / 2, y: Y + 29,
            fill: COLORS.text, 'font-size': '15', 'font-weight': 'bold',
            'text-anchor': 'middle', 'font-family': 'Arial',
        });
        vt.textContent = val;
        svg.appendChild(vt);

        // Index label below
        const it = makeSvgEl('text', {
            x: x + NODE_W / 2, y: Y + NODE_H + 18,
            fill: '#9ca3af', 'font-size': '11', 'text-anchor': 'middle', 'font-family': 'Arial',
        });
        it.textContent = `[${i}]`;
        svg.appendChild(it);

        // HEAD label
        if (i === 0) {
            const hl = makeSvgEl('text', {
                x: x + NODE_W / 2, y: labelY,
                fill: '#fbbf24', 'font-size': '12', 'font-weight': 'bold',
                'text-anchor': 'middle', 'font-family': 'Arial',
            });
            hl.textContent = 'HEAD';
            svg.appendChild(hl);
            // HEAD arrow
            const line = makeSvgEl('line', {
                x1: x + NODE_W / 2, y1: labelY + 4,
                x2: x + NODE_W / 2, y2: Y - 4,
                stroke: '#fbbf24', 'stroke-width': '1.5',
                'marker-end': 'url(#arrowYellow)',
            });
            svg.appendChild(line);
        }

        // Pointer arrow to next
        if (i < ll.length - 1) {
            const ax1 = x + NODE_W;
            const ax2 = ax1 + GAP;
            const ay = Y + NODE_H / 2;
            const line = makeSvgEl('line', {
                x1: ax1, y1: ay, x2: ax2 - 6, y2: ay,
                stroke: COLORS.pointer, 'stroke-width': '2',
                'marker-end': 'url(#arrowBlue)',
            });
            svg.appendChild(line);
        } else {
            // NULL
            const nt = makeSvgEl('text', {
                x: x + NODE_W + 8, y: Y + NODE_H / 2 + 5,
                fill: COLORS.null_text, 'font-size': '12', 'font-weight': 'bold', 'font-family': 'Arial',
            });
            nt.textContent = '→ NULL';
            svg.appendChild(nt);
        }
    });

    ensureArrowDefs();
}

function ensureArrowDefs() {
    if (document.getElementById('svgDefs')) return;
    const defs = makeSvgEl('defs', { id: 'svgDefs' });
    defs.innerHTML = `
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#4cc9f0"/>
        </marker>
        <marker id="arrowYellow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#fbbf24"/>
        </marker>`;
    svg.insertBefore(defs, svg.firstChild);
}

function makeSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

function flash(idx) {
    highlightIdx = idx;
    render();
    setTimeout(() => { highlightIdx = -1; render(); }, 900);
}

document.getElementById('insertFrontBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    ll.unshift(v);
    setStatus(`Inserted ${v} at Front`);
    flash(0);
});

document.getElementById('insertEndBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    ll.push(v);
    setStatus(`Inserted ${v} at End`);
    flash(ll.length - 1);
});

document.getElementById('insertIdxBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    const idx = parseInt(nodeIdxInput.value);
    if (idx < 0 || idx > ll.length) { setStatus(`Invalid index ${idx}`); return; }
    ll.splice(idx, 0, v);
    setStatus(`Inserted ${v} at Index ${idx}`);
    flash(idx);
});

document.getElementById('deleteFrontBtn').addEventListener('click', () => {
    if (ll.length === 0) { setStatus('List is empty — nothing to delete'); return; }
    const v = ll.shift();
    setStatus(`Deleted ${v} from Front`);
    render();
});

document.getElementById('deleteEndBtn').addEventListener('click', () => {
    if (ll.length === 0) { setStatus('List is empty — nothing to delete'); return; }
    const v = ll.pop();
    setStatus(`Deleted ${v} from End`);
    render();
});

document.getElementById('deleteIdxBtn').addEventListener('click', () => {
    const idx = parseInt(nodeIdxInput.value);
    if (idx < 0 || idx >= ll.length) { setStatus(`Invalid index ${idx}`); return; }
    const v = ll.splice(idx, 1)[0];
    setStatus(`Deleted ${v} at Index ${idx}`);
    render();
});

document.getElementById('updateBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    const idx = parseInt(nodeIdxInput.value);
    if (idx < 0 || idx >= ll.length) { setStatus(`Invalid index ${idx}`); return; }
    const old = ll[idx];
    ll[idx] = v;
    setStatus(`Updated Index ${idx}: ${old} → ${v}`);
    flash(idx);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    ll = [10, 20, 30, 40];
    highlightIdx = -1;
    setStatus('Reset — Singly Linked List restored to [10 → 20 → 30 → 40]');
    render();
});

render();
