const svg = document.getElementById('dllSvg');
const statusMsg = document.getElementById('statusMsg');
const nodeValInput = document.getElementById('nodeVal');

const NODE_W = 72;
const NODE_H = 50;
const GAP = 55;
const START_X = 40;
const Y = 90;

let dll = [5, 15, 25];
let highlightIdx = -1;

function setStatus(msg) { statusMsg.textContent = msg; }

function makeSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

function ensureDefs() {
    if (svg.querySelector('defs')) return;
    const defs = makeSvgEl('defs', {});
    defs.innerHTML = `
        <marker id="fwdArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ff7850"/>
        </marker>
        <marker id="bwdArrow" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
            <path d="M8,0 L8,6 L0,3 z" fill="#ff7850"/>
        </marker>
        <marker id="headArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#fbbf24"/>
        </marker>
        <marker id="tailArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa"/>
        </marker>`;
    svg.insertBefore(defs, svg.firstChild);
}

function render() {
    const totalW = dll.length * (NODE_W + GAP) + GAP + START_X + 80;
    svg.setAttribute('viewBox', `0 0 ${Math.max(totalW, 400)} 200`);
    svg.setAttribute('width', Math.max(totalW, 400));

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    ensureDefs();

    if (dll.length === 0) {
        const t = makeSvgEl('text', { x: 150, y: 100, fill: '#6b7280', 'font-size': '16', 'font-weight': 'bold', 'font-family': 'Arial' });
        t.textContent = 'Empty Doubly Linked List [NULL]';
        svg.appendChild(t);
        return;
    }

    const labelY = Y - 30;

    dll.forEach((val, i) => {
        const x = START_X + i * (NODE_W + GAP);
        const isActive = i === highlightIdx;
        const fill = isActive ? '#f72585' : '#8250d2';

        const rect = makeSvgEl('rect', {
            x, y: Y, width: NODE_W, height: NODE_H,
            rx: 5, fill, stroke: isActive ? '#fff' : '#a855f7', 'stroke-width': isActive ? 2.5 : 1.5,
        });
        svg.appendChild(rect);

        const vt = makeSvgEl('text', {
            x: x + NODE_W / 2, y: Y + 30,
            fill: '#f0f0f0', 'font-size': '15', 'font-weight': 'bold',
            'text-anchor': 'middle', 'font-family': 'Arial',
        });
        vt.textContent = val;
        svg.appendChild(vt);

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
            const la = makeSvgEl('line', {
                x1: x + NODE_W / 2, y1: labelY + 4,
                x2: x + NODE_W / 2, y2: Y - 4,
                stroke: '#fbbf24', 'stroke-width': '1.5', 'marker-end': 'url(#headArrow)',
            });
            svg.appendChild(la);
        }

        // TAIL label
        if (i === dll.length - 1) {
            const tl = makeSvgEl('text', {
                x: x + NODE_W / 2, y: labelY,
                fill: '#a78bfa', 'font-size': '12', 'font-weight': 'bold',
                'text-anchor': 'middle', 'font-family': 'Arial',
            });
            tl.textContent = dll.length === 1 ? 'HEAD/TAIL' : 'TAIL';
            svg.appendChild(tl);
        }

        // Forward arrow (→)
        if (i < dll.length - 1) {
            const ax1 = x + NODE_W;
            const ax2 = ax1 + GAP;
            const ay = Y + 14;
            const fwd = makeSvgEl('line', {
                x1: ax1, y1: ay, x2: ax2 - 6, y2: ay,
                stroke: '#ff7850', 'stroke-width': '2', 'marker-end': 'url(#fwdArrow)',
            });
            svg.appendChild(fwd);

            // Backward arrow (←)
            const by = Y + 36;
            const bwd = makeSvgEl('line', {
                x1: ax2, y1: by, x2: ax1 + 8, y2: by,
                stroke: '#ff7850', 'stroke-width': '2', 'marker-end': 'url(#bwdArrow)',
            });
            svg.appendChild(bwd);
        }

        // NULL labels
        if (i === 0) {
            const nt = makeSvgEl('text', {
                x: x - 6, y: Y + 36,
                fill: '#6b7280', 'font-size': '10', 'text-anchor': 'end', 'font-family': 'Arial',
            });
            nt.textContent = 'NULL ←';
            svg.appendChild(nt);
        }
        if (i === dll.length - 1) {
            const nt = makeSvgEl('text', {
                x: x + NODE_W + 6, y: Y + 14,
                fill: '#6b7280', 'font-size': '10', 'font-family': 'Arial',
            });
            nt.textContent = '→ NULL';
            svg.appendChild(nt);
        }
    });
}

function flash(idx) {
    highlightIdx = idx;
    render();
    setTimeout(() => { highlightIdx = -1; render(); }, 900);
}

document.getElementById('insertFrontBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    dll.unshift(v);
    setStatus(`Inserted ${v} at Front`);
    flash(0);
});

document.getElementById('insertEndBtn').addEventListener('click', () => {
    const v = parseInt(nodeValInput.value);
    dll.push(v);
    setStatus(`Inserted ${v} at End`);
    flash(dll.length - 1);
});

document.getElementById('deleteFrontBtn').addEventListener('click', () => {
    if (dll.length === 0) { setStatus('List is empty'); return; }
    const v = dll.shift();
    setStatus(`Deleted ${v} from Front`);
    render();
});

document.getElementById('deleteEndBtn').addEventListener('click', () => {
    if (dll.length === 0) { setStatus('List is empty'); return; }
    const v = dll.pop();
    setStatus(`Deleted ${v} from End`);
    render();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    dll = [5, 15, 25];
    highlightIdx = -1;
    setStatus('Reset — Doubly Linked List restored to [25 ⇌ 15 ⇌ 5]');
    render();
});

render();
