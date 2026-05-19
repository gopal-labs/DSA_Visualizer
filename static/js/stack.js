const svg = document.getElementById('stackSvg');
const statusMsg = document.getElementById('statusMsg');
const sizeInfo = document.getElementById('sizeInfo');
const stackValInput = document.getElementById('stackVal');
const maxSizeInput = document.getElementById('maxSize');

const BOX_W = 180;
const BOX_H = 38;
const BOX_X = 40;
const SVG_H = 340;

let stack = [];
let maxSize = 8;
let highlightTop = false;

function setStatus(msg) { statusMsg.textContent = msg; }

function makeSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

function updateSizeInfo() {
    sizeInfo.textContent = `Size: ${stack.length} / ${maxSize}`;
}

function render() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    updateSizeInfo();

    // Draw base line
    const base = makeSvgEl('line', {
        x1: BOX_X - 5, y1: SVG_H - 20,
        x2: BOX_X + BOX_W + 5, y2: SVG_H - 20,
        stroke: '#4b5563', 'stroke-width': 3,
    });
    svg.appendChild(base);

    // Draw slot outlines (ghost slots)
    for (let i = 0; i < maxSize; i++) {
        const y = SVG_H - 20 - (i + 1) * BOX_H;
        const ghost = makeSvgEl('rect', {
            x: BOX_X, y, width: BOX_W, height: BOX_H - 2,
            rx: 3, fill: 'none', stroke: '#1f2937', 'stroke-width': 1,
        });
        svg.appendChild(ghost);
    }

    // Draw actual stack items
    stack.forEach((val, i) => {
        const y = SVG_H - 20 - (i + 1) * BOX_H;
        const isTop = i === stack.length - 1;
        const fill = highlightTop && isTop ? '#f72585' : (isTop ? '#3b82f6' : '#1d4ed8');
        const stroke = isTop ? '#93c5fd' : '#3b82f6';

        const rect = makeSvgEl('rect', {
            x: BOX_X, y, width: BOX_W, height: BOX_H - 2,
            rx: 3, fill, stroke, 'stroke-width': isTop ? 2 : 1,
        });
        svg.appendChild(rect);

        const vt = makeSvgEl('text', {
            x: BOX_X + BOX_W / 2, y: y + BOX_H / 2 + 5,
            fill: '#f0f0f0', 'font-size': '14', 'font-weight': 'bold',
            'text-anchor': 'middle', 'font-family': 'Arial',
        });
        vt.textContent = val;
        svg.appendChild(vt);

        if (isTop) {
            const label = makeSvgEl('text', {
                x: BOX_X + BOX_W + 10, y: y + BOX_H / 2 + 5,
                fill: '#fbbf24', 'font-size': '11', 'font-weight': 'bold', 'font-family': 'Arial',
            });
            label.textContent = '← TOP';
            svg.appendChild(label);
        }
    });

    // Overflow line
    if (maxSize <= 12) {
        const limitY = SVG_H - 20 - maxSize * BOX_H;
        const limLine = makeSvgEl('line', {
            x1: BOX_X - 5, y1: limitY,
            x2: BOX_X + BOX_W + 5, y2: limitY,
            stroke: '#ef4444', 'stroke-width': 1.5, 'stroke-dasharray': '5,3',
        });
        svg.appendChild(limLine);
        const limText = makeSvgEl('text', {
            x: BOX_X + BOX_W + 10, y: limitY + 5,
            fill: '#ef4444', 'font-size': '10', 'font-family': 'Arial',
        });
        limText.textContent = 'MAX';
        svg.appendChild(limText);
    }

    // Empty label
    if (stack.length === 0) {
        const et = makeSvgEl('text', {
            x: BOX_X + BOX_W / 2, y: SVG_H - 30,
            fill: '#6b7280', 'font-size': '13', 'text-anchor': 'middle', 'font-family': 'Arial',
        });
        et.textContent = 'Stack Empty';
        svg.appendChild(et);
    }
}

function flash() {
    highlightTop = true;
    render();
    setTimeout(() => { highlightTop = false; render(); }, 700);
}

document.getElementById('pushBtn').addEventListener('click', () => {
    maxSize = parseInt(maxSizeInput.value) || 8;
    if (stack.length >= maxSize) {
        setStatus('Overflow! Stack is full — cannot push');
        return;
    }
    const v = parseInt(stackValInput.value);
    stack.push(v);
    setStatus(`Pushed ${v} onto the stack`);
    flash();
});

document.getElementById('popBtn').addEventListener('click', () => {
    if (stack.length === 0) {
        setStatus('Underflow! Stack is empty — nothing to pop');
        return;
    }
    const v = stack.pop();
    setStatus(`Popped ${v} from the stack`);
    render();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    stack = [];
    highlightTop = false;
    setStatus('Stack reset — empty');
    render();
});

render();
