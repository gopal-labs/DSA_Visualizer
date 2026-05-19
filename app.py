from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sorting")
def sorting():
    return render_template("sorting.html")

@app.route("/singly-ll")
def singly_ll():
    return render_template("singly_ll.html")

@app.route("/doubly-ll")
def doubly_ll():
    return render_template("doubly_ll.html")

@app.route("/stack")
def stack():
    return render_template("stack.html")

@app.route("/queue")
def queue():
    return render_template("queue.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
