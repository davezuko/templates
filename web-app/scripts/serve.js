import http from "http"
import connect from "connect"
import compression from "compression"
import serve_static from "serve-static"

let main = async () => {
    let app = connect()
    app.use(compression())
    app.use(serve_static("./dist"))
    let server = http.createServer(app)
    server.listen(3000, () => {
        console.log("server running at http://localhost:3000")
    })
}

main()
