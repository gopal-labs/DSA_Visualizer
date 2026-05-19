const svg = document.getElementById('queueSvg');
const statusMsg = document.getElementById('statusMsg');
const sizeInfo = document.getElementById('sizeInfo');
const queueValInput = document.getElementById('queueVal');
const maxSizeInput = document.getElementById('maxSize');

const BOX_SIZE = 64;
const BOX_GAP = 14;
const START_X = 40;
const Y = 70;
const SVG_H = 180;

let queue = [10, 20, 30, 40];
let maxSize = 10;
let highlightIdx = -1;

function setStatus(msg) { statusMsg.textContent = msg; }

function makeSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

function updateSizeInfo() {
    sizeInfo.textContent = `Size: ${queue.length} / ${maxSize}`;
}

function render() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    updateSizeInfo();

    const totalW = queue.length * (BOX_SIZE + BOX_GAP) + START_X + 120;
    svg.setAttribute('viewBox', `0 0 ${Math.max(totalW, 600)} ${SVG_H}`);

    if (queue.length === 0) {
        const et = makeSvgEl('text', {
            x: 200, y: Y + BOX_SIZE / 2 + 5,
            fill: '#6b7280', 'font-size': '15', 'font-family': 'Arial', 'font-weight': 'bold',
        });
        et.textContent = 'Queue Empty';
        svg.appendChild(et);
        return;
    }

    queue.forEach((val, i) => {
        const x = START_X + i * (BOX_SIZE + BOX_GAP);
        const isFront = i === 0;
        const isRear = i === queue.length - 1;
        const isHighlight = i === highlightIdx;

        const fill = isHighlight ? '#f72585' : '#22c55e';
        const stroke = isHighlight ? '#fff' : '#15803d';

        const rect = makeSvgEl('rect', {
            x, y: Y, width: BOX_SIZE, height: BOX_SIZE,
            rx: 5, fill, stroke, 'stroke-width': isHighlight ? 2.5 : 1.5,
        });
        svg.appendChild(rect);

        const vt = makeSvgEl('text', {
            x: x + BOX_SIZE / 2, y: Y + BOX_SIZE / 2 + 6,
            fill: '#0d1117', 'font-size': '15', 'font-weight': 'bold',
            'text-anchor': 'middle', 'font-family': 'Arial',
        });
        vt.textContent = val;
        svg.appendChild(vt);

        // Index label
        const it = makeSvgEl('text', {
            x: x + BOX_SIZE / 2, y: Y + BOX_SIZE + 18,
            fill: '#9ca3af', 'font-size': '10', 'text-anchor': 'middle', 'font-family': 'Arial',
        });
        it.textContent = `[${i}]`;
        svg.appendChild(it);

        if (isFront) {
            const lbl = makeSvgEl('text', {
                x: x + BOX_SIZE / 2, y: Y - 16,
                fill: '#4ade80', 'font-size': '11', 'font-weight': 'bold',
                'text-anchor': 'middle', 'font-family': 'Arial',
            });
            lbl.textContent = '← FRONT (Dequeues next)';
            svg.appendChild(lbl);
        }

        if (isRear) {
            const lbl = makeSvgEl('text', {
                x: x + BOX_SIZE / 2, y: Y - 4,
                fill: '#f87171', 'font-size': '10', 'font-weight': 'bold',
                'text-anchor': 'middle', 'font-family': 'Arial',
            });
            lbl.textContent = '▲ REAR';
            svg.appendChild(lbl);
        }

        // Connecting arrow to next
        if (i < queue.length - 1) {
            const ax1 = x + BOX_SIZE;
            const ax2 = ax1 + BOX_GAP;
            const ay = Y + BOX_SIZE / 2;
            const line = makeSvgEl('line', {
                x1: ax1, y1: ay, x2: ax2 - 4, y2: ay,
                stroke: '#4b5563', 'stroke-width': '1.5',
                'marker-end': 'url(#qArrow)',
            });
            svg.appendChild(line);
        }
    });

    // Arrow marker def
    if (!svg.querySelector('defs')) {
        const defs = makeSvgEl('defs', {});
        defs.innerHTML = `<marker id="qArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#4b5563"/>
        </marker>`;
        svg.insertBefore(defs, svg.firstChild);
    }
}

function flash(idx) {
    highlightIdx = idx;
    render();
    setTimeout(() => { highlightIdx = -1; render(); }, 800);
}

document.getElementById('enqueueBtn').addEventListener('click', () => {
    maxSize = parseInt(maxSizeInput.value) || 10;
    if (queue.length >= maxSize) {
        setStatus('Queue Full! Cannot enqueue more elements');
        return;
    }
    const v = parseInt(queueValInput.value);
    queue.push(v);
    setStatus(`Enqueued ${v} at the Rear`);
    flash(queue.length - 1);
});

document.getElementById('dequeueBtn').addEventListener('click', () => {
    if (queue.length === 0) {
        setStatus('Queue Underflow! Nothing to dequeue');
        return;
    }
    const v = queue.shift();
    setStatus(`Dequeued ${v} from the Front`);
    render();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    queue = [10, 20, 30, 40];
    highlightIdx = -1;
    setStatus('Queue reset to [10, 20, 30, 40]');
    render();
});

render();
