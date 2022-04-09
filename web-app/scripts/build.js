import fs from "fs"
import util from "util"
import esbuild from "esbuild"
import _copydir from "copy-dir"
import {config} from "./_config.js"

let copydir = util.promisify(_copydir)
let verbose = process.argv.includes("--verbose")

let main = async () => {
    await fs.promises.rm("dist", {force: true, recursive: true})
    let result = await esbuild.build({
        ...config.esbuild,
        minify: config.esbuild.minify ?? true,
        metafile: true,
        define: {
            ...config.esbuild.define,
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV || "production",
            ),
        },
    })
    await copydir("./static", "./dist")
    let text = await esbuild.analyzeMetafile(result.metafile, {verbose})
    console.info(text)
}

main()
