# Ultimate Web-Based DSA Visualizer Suite

An interactive, multi-module web application built in Python using **Flask**, and frontend web graphics (**JavaScript**) to help visualize fundamental Data Structures and Algorithms (DSA). This suite features real-time web animations for 8 different sorting algorithms, Singly and Doubly Linked Lists, as well as Stack and Queue data structures.

---

## 🚀 Features

### 1. Sorting Algorithms Visualizer
Visualize comparison-based and non-comparison-based sorting algorithms with real-time web browser rendering and value tracking.
* **Quadratic \(O(n^2)\):** Bubble Sort, Insertion Sort, Selection Sort
* **Logarithmic \(O(n \log n)\):** Quick Sort, Merge Sort, Heap Sort
* **Linear \(O(n)\):** Counting Sort, Radix Sort

### 2. Linear Data Structures
Dynamic HTML5/SVG structural layouts displaying sequential flow, nodes, and pointers:
* **Singly Linked List:** Core pointer adjustments including Insertion (Front/End/Index), Deletion (Front/End/Index), and node updates.
* **Doubly Linked List:** Displays bidirectional nodes utilizing twin structural forward/backward arrow pointers.
* **Stack:** Vertical browser layout demonstrating Last-In, First-Out (LIFO) tracking with Push, Pop, Overflow, and Underflow constraints.
* **Queue:** Horizontal timeline layout illustrating First-In, First-Out (FIFO) mechanics with Enqueue and Dequeue operations.

---

## 📂 Project Architecture

The suite uses a clean Model-View-Controller layout separating Python backend logic from frontend Jinja2 HTML templates and JavaScript animation scripts:

```text
DSA_PROJECT/
│
├── static/                 # Static assets for the web browser
│   ├── css/                # Custom stylesheets for UI layouts
│   └── js/                 # Javascript files handling SVG rendering & animations
│
├── templates/              # Jinja2 HTML views
│   ├── base.html           # Core layout grid & universal navigation header
│   ├── index.html          # Main hub / Dashboard route grid
│   ├── singly_ll.html      # Visualizer interface for Singly Linked Lists
│   ├── doubly_ll.html      # Visualizer interface for Doubly Linked Lists
│   ├── queue.html          # Interface layout for Queue data structure
│   ├── stack.html          # Interface layout for Stack data structure
│   └── sorting.html        # Interactive layout for the 8 sorting routines
│
├── app.py                  # Main Flask application engine & route controller
└── requirement.txt         # Project runtime python dependency manifests
```

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd DSA_PROJECT
   ```

2. **Install requirements:**
   ```bash
   pip install -r requirement.txt
   ```

3. **Run the local development server:**
   ```bash
   python app.py
   ```
   *Alternatively, run via the Flask CLI:*
   ```bash
   export FLASK_APP=app.py
   flask run
   ```

4. **Open your web browser:**
   Navigate to `http://127.0.0` to launch the dashboard.
