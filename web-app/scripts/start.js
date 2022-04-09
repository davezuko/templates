import esbuild from "esbuild"
import {config} from "./_config.js"

let main = async () => {
    let server = await esbuild.serve(
        {
            servedir: "static",
            port: 3000,
        },
        {
            ...config.esbuild,
            minify: false,
            splitting: true,
            outdir: "static/assets",
            sourcemap: "linked",
        },
    )
    console.log("server running at http://localhost:%s", server.port)
}

main()
