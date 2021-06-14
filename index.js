let tb = null
let render = null

document.onreadystatechange = function () {
  tb = document.querySelector("textarea")
  render = document.querySelector("#main")
}

let events = []
let tapterm = 180
let scale = 3

function updateGraph(noupdatejson) {
  const data = events.map(([a, b, c]) => [a, b, c - events[0][2]])
  render.innerHTML = visualize(toTuples(data))

  document.getElementById("last").scrollIntoView()
  if (!noupdatejson) {
    document.getElementById("copypasta").value = JSON.stringify(events)
  }
}

document.addEventListener("keydown", (e) => {
  events.push([true, e.key, Date.now()])
  updateGraph()
})
document.addEventListener("keyup", (e) => {
  events.push([false, e.key, Date.now()])
  updateGraph()
})

function oninputchange() {
  events = JSON.parse(document.getElementById("copypasta").value)
  tapterm = document.getElementById("tapterm").value
  scale = document.getElementById("scale").value
  updateGraph(true)
}

function toTuples(data) {
  let tuples = []
  let pending = {}
  let levels = new Array(30).map((_) => false)

  for (let [down, key, time] of data) {
    if (down) {
      let level = levels.findIndex((x) => !x)
      pending[key] = [level, time]
      levels[level] = true
    } else {
      if (!pending[key]) continue
      tuples.push([key, ...pending[key], time])
      levels[pending[key][0]] = false
    }
  }
  return tuples
}

function visualize(data) {
  let s = "<div class='visualization'>"

  for (let i = 0; i < data.length; i++) {
    let [key, level, start, end] = data[i]

    let dur = end - start

    s += `
      <div 
        id="${i === data.length - 1 ? "last" : ""}" 
        class='inputBlock'
        style='
          width: ${dur / scale}; 
          top: ${level * 30}px; 
          left: ${start / scale}px;
        '
      >${
        end - start < 180
          ? key
          : `<div class="termBlock" 
                  style='width: ${tapterm / scale}px'
             >${key}</div>`
      }</div>
    `
  }
  return s + "</div>"
}

// vim:ft=javascript
