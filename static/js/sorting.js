const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');
const algoSelect = document.getElementById('algoSelect');
const barCountInput = document.getElementById('barCount');
const speedSlider = document.getElementById('speedSlider');
const runBtn = document.getElementById('runBtn');
const randomBtn = document.getElementById('randomBtn');
const stopBtn = document.getElementById('stopBtn');
const statusMsg = document.getElementById('statusMsg');
const compCount = document.getElementById('compCount');

const COLORS = {
    bar: '#00b4d8',
    compare: '#d62828',
    sorted: '#38b000',
    pivot: '#f77f00',
    bg: '#0d1117',
    text: '#e0e0e0',
    line: '#374151',
};

let data = [];
let animating = false;
let stopRequested = false;
let comparisons = 0;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
}

function randomData() {
    const n = Math.max(5, Math.min(60, parseInt(barCountInput.value) || 25));
    data = Array.from({ length: n }, () => Math.floor(Math.random() * 380) + 30);
    comparisons = 0;
    compCount.textContent = '';
    drawBars({ sortedSet: new Set() });
    statusMsg.textContent = 'New array generated — choose an algorithm and press Run';
}

function getDelay() {
    const s = parseInt(speedSlider.value);
    return Math.max(5, 550 - s * 50);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawBars(opts = {}) {
    const { compareA = -1, compareB = -1, pivot = -1, sortedSet = new Set(), finishedAll = false } = opts;
    const W = canvas.width;
    const H = canvas.height;
    const n = data.length;
    const bw = Math.floor((W - 20) / n);
    const maxVal = Math.max(...data);

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < n; i++) {
        const x = 10 + i * bw;
        const barH = Math.floor((data[i] / maxVal) * (H - 60));
        const y = H - barH - 20;

        if (finishedAll) {
            ctx.fillStyle = COLORS.sorted;
        } else if (i === pivot) {
            ctx.fillStyle = COLORS.pivot;
        } else if (i === compareA || i === compareB) {
            ctx.fillStyle = COLORS.compare;
        } else if (sortedSet.has(i)) {
            ctx.fillStyle = COLORS.sorted;
        } else {
            ctx.fillStyle = COLORS.bar;
        }

        const rw = Math.max(bw - 3, 1);
        ctx.beginPath();
        ctx.roundRect(x, y, rw, barH, 3);
        ctx.fill();

        if (bw > 20) {
            ctx.fillStyle = COLORS.text;
            ctx.font = `bold ${Math.min(11, bw - 4)}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(data[i], x + rw / 2, y - 4);
        }
    }
}

async function runAlgo() {
    if (animating) return;
    animating = true;
    stopRequested = false;
    comparisons = 0;
    runBtn.disabled = true;
    randomBtn.disabled = true;
    stopBtn.disabled = false;

    const algo = algoSelect.value;
    const algoNames = {
        bubble: 'Bubble Sort', insertion: 'Insertion Sort', selection: 'Selection Sort',
        quick: 'Quick Sort', merge: 'Merge Sort', heap: 'Heap Sort',
        counting: 'Counting Sort', radix: 'Radix Sort',
    };
    statusMsg.textContent = `Running ${algoNames[algo]}...`;

    const sortedSet = new Set();

    const update = (a, b, piv) => {
        comparisons++;
        compCount.textContent = `Comparisons: ${comparisons}`;
        drawBars({ compareA: a, compareB: b, pivot: piv, sortedSet });
        return sleep(getDelay());
    };

    switch (algo) {
        case 'bubble': await bubbleSort(sortedSet, update); break;
        case 'insertion': await insertionSort(sortedSet, update); break;
        case 'selection': await selectionSort(sortedSet, update); break;
        case 'quick': await quickSort(0, data.length - 1, sortedSet, update); break;
        case 'merge': await mergeSort(0, data.length - 1, sortedSet, update); break;
        case 'heap': await heapSort(sortedSet, update); break;
        case 'counting': await countingSort(sortedSet, update); break;
        case 'radix': await radixSort(sortedSet, update); break;
    }

    if (!stopRequested) {
        drawBars({ finishedAll: true });
        statusMsg.textContent = `${algoNames[algo]} complete! Array is sorted. Press Randomize to reset.`;
    } else {
        statusMsg.textContent = 'Stopped. Press Randomize to reset.';
    }

    animating = false;
    runBtn.disabled = false;
    randomBtn.disabled = false;
    stopBtn.disabled = true;
}

async function bubbleSort(sortedSet, update) {
    const n = data.length;
    for (let i = 0; i < n && !stopRequested; i++) {
        for (let j = 0; j < n - i - 1 && !stopRequested; j++) {
            await update(j, j + 1, -1);
            if (data[j] > data[j + 1]) [data[j], data[j + 1]] = [data[j + 1], data[j]];
        }
        sortedSet.add(n - 1 - i);
    }
}

async function insertionSort(sortedSet, update) {
    const n = data.length;
    sortedSet.add(0);
    for (let i = 1; i < n && !stopRequested; i++) {
        let key = data[i];
        let j = i - 1;
        while (j >= 0 && data[j] > key && !stopRequested) {
            await update(j, j + 1, -1);
            data[j + 1] = data[j];
            j--;
        }
        data[j + 1] = key;
        sortedSet.add(i);
    }
}

async function selectionSort(sortedSet, update) {
    const n = data.length;
    for (let i = 0; i < n && !stopRequested; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n && !stopRequested; j++) {
            await update(j, minIdx, -1);
            if (data[j] < data[minIdx]) minIdx = j;
        }
        [data[i], data[minIdx]] = [data[minIdx], data[i]];
        sortedSet.add(i);
    }
}

async function quickSort(low, high, sortedSet, update) {
    if (low < high && !stopRequested) {
        const pi = await partition(low, high, sortedSet, update);
        sortedSet.add(pi);
        await quickSort(low, pi - 1, sortedSet, update);
        await quickSort(pi + 1, high, sortedSet, update);
    }
}

async function partition(low, high, sortedSet, update) {
    const pivot = data[high];
    let i = low - 1;
    for (let j = low; j < high && !stopRequested; j++) {
        await update(j, high, high);
        if (data[j] < pivot) {
            i++;
            [data[i], data[j]] = [data[j], data[i]];
        }
    }
    [data[i + 1], data[high]] = [data[high], data[i + 1]];
    return i + 1;
}

async function mergeSort(l, r, sortedSet, update) {
    if (l < r && !stopRequested) {
        const m = Math.floor((l + r) / 2);
        await mergeSort(l, m, sortedSet, update);
        await mergeSort(m + 1, r, sortedSet, update);
        await merge(l, m, r, sortedSet, update);
    }
}

async function merge(l, m, r, sortedSet, update) {
    const left = data.slice(l, m + 1);
    const right = data.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length && !stopRequested) {
        await update(k, -1, -1);
        if (left[i] <= right[j]) { data[k++] = left[i++]; }
        else { data[k++] = right[j++]; }
    }
    while (i < left.length) { data[k++] = left[i++]; }
    while (j < right.length) { data[k++] = right[j++]; }
    for (let x = l; x <= r; x++) sortedSet.add(x);
}

async function heapSort(sortedSet, update) {
    const n = data.length;
    async function heapify(size, root) {
        let largest = root;
        const l = 2 * root + 1;
        const r = 2 * root + 2;
        if (l < size && data[l] > data[largest]) largest = l;
        if (r < size && data[r] > data[largest]) largest = r;
        if (largest !== root && !stopRequested) {
            await update(root, largest, -1);
            [data[root], data[largest]] = [data[largest], data[root]];
            await heapify(size, largest);
        }
    }
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    for (let i = n - 1; i > 0 && !stopRequested; i--) {
        [data[0], data[i]] = [data[i], data[0]];
        sortedSet.add(i);
        await heapify(i, 0);
    }
    sortedSet.add(0);
}

async function countingSort(sortedSet, update) {
    const maxVal = Math.max(...data);
    const count = new Array(maxVal + 1).fill(0);
    for (const x of data) count[x]++;
    let idx = 0;
    for (let val = 0; val <= maxVal && !stopRequested; val++) {
        for (let f = 0; f < count[val] && !stopRequested; f++) {
            data[idx] = val;
            sortedSet.add(idx);
            await update(idx, -1, -1);
            idx++;
        }
    }
}

async function radixSort(sortedSet, update) {
    const maxVal = Math.max(...data);
    let exp = 1;
    while (Math.floor(maxVal / exp) > 0 && !stopRequested) {
        const output = new Array(data.length).fill(0);
        const count = new Array(10).fill(0);
        for (const v of data) count[Math.floor(v / exp) % 10]++;
        for (let i = 1; i < 10; i++) count[i] += count[i - 1];
        for (let i = data.length - 1; i >= 0; i--) {
            const idx = Math.floor(data[i] / exp) % 10;
            output[--count[idx]] = data[i];
        }
        for (let i = 0; i < data.length && !stopRequested; i++) {
            data[i] = output[i];
            sortedSet.add(i);
            await update(i, -1, -1);
        }
        exp *= 10;
    }
}

// Event listeners
runBtn.addEventListener('click', runAlgo);
randomBtn.addEventListener('click', randomData);
stopBtn.addEventListener('click', () => { stopRequested = true; });

window.addEventListener('resize', () => {
    resizeCanvas();
    drawBars({ sortedSet: new Set() });
});

// Init
resizeCanvas();
randomData();
