import "preact/debug"
import "./main.css"
import * as React from "react"
import * as ReactDOM from "react-dom/client"

let App = () => {
    return <h1>Hello world</h1>
}

let main = () => {
    let root = ReactDOM.createRoot(document.getElementById("root")!)
    root.render(<App />)
}

main()
