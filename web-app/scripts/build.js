import fs from "fs"
import esbuild from "esbuild"
import {minify as minify_html} from "html-minifier-terser"
import {config} from "./_config.js"

let verbose = process.argv.includes("--verbose")

let main = async () => {
    await fs.promises.rm("dist", {force: true, recursive: true})

    let minify = config.esbuild.minify ?? true
    let result = await esbuild.build({
        ...config.esbuild,
        minify,
        metafile: true,
        define: {
            ...config.esbuild.define,
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV || "production",
            ),
        },
    })

    await fs.promises.cp("./static", "./dist", {recursive: true})

    if (minify) {
        let html_files = ["./dist/index.html"]
        for (let file of html_files) {
            let text = await fs.promises.readFile(file, "utf8")
            let minified = await minify_html(text, {
                minifyCSS: true,
                minifyJS: false,
                collapseWhitespace: true,
                removeComments: true,
            })
            await fs.promises.writeFile(file, minified, "utf8")
        }
    }

    let text = await esbuild.analyzeMetafile(result.metafile, {verbose})
    console.info(text)
}

main()
