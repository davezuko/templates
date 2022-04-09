import path from "path"

let create_config = () => {
    let use_preact = true
    let enable_devtools = false
    let strip_console = false

    let config = {
        esbuild: {
            entryPoints: {
                main: "./src/main",
                vendors: "./src/vendors.ts",
                "css/global": "./src/css/global.css",
            },
            outdir: "dist/assets",
            bundle: true,
            format: "esm",
            platform: "browser",
            target: "esnext",
            splitting: true,
            pure: [],
            plugins: [],
            define: {
                "process.env.NODE_ENV": JSON.stringify(
                    process.env.NODE_ENV || "development",
                ),
            },
        },
    }
    for (let arg of process.argv.slice(2)) {
        if (arg.startsWith("--split")) {
            config.esbuild.splitting = read_flag_bool(arg)
            continue
        }
        if (arg.startsWith("--devtools")) {
            enable_devtools = read_flag_bool(arg)
            continue
        }
        if (arg.startsWith("--strip-console")) {
            strip_console = read_flag_bool(arg)
            continue
        }
        if (arg.startsWith("--minify")) {
            config.esbuild.minify = read_flag_bool(arg)
            continue
        }
        if (arg.startsWith("--react")) {
            use_preact = !read_flag_bool(arg)
            continue
        }
    }
    if (strip_console) {
        config.esbuild.pure.push(
            "console.debug",
            "console.error",
            "console.info",
            "console.log",
            "console.warn",
        )
    }
    config.esbuild.plugins.push(
        esbuild_plugin_react({
            enabled: use_preact,
            devtools: enable_devtools,
        }),
    )
    return config
}

let read_flag_bool = (flag) => {
    let value = read_flag_value(flag)
    return value !== "0"
}

let read_flag_value = (flag) => {
    return flag.split("=")[1]
}

let esbuild_plugin_react = (options) => {
    return {
        name: "preact",
        setup(build) {
            if (!options.devtools || !options.enabled) {
                build.onLoad(
                    {filter: /^preact\/debug$/, namespace: "preact/debug"},
                    () => {
                        return {
                            contents: "",
                        }
                    },
                )
                build.onResolve({filter: /^preact\/debug$/}, () => {
                    return {
                        path: "preact/debug",
                        namespace: "preact/debug",
                    }
                })
            }
            if (options.enabled) {
                build.onResolve(
                    {filter: /^(react|react-dom|preact\/compat)$/},
                    (_args) => {
                        let dest = path.join(
                            process.cwd(),
                            "node_modules/preact/compat/dist/compat.module.js",
                        )
                        // console.log("resolve %s -> %s", _args.path, dest)
                        return {path: dest}
                    },
                )
                build.onResolve({filter: /^(react-dom\/client)$/}, (_args) => {
                    let dest = path.join(
                        process.cwd(),
                        "node_modules/preact/compat/client.mjs",
                    )
                    // console.log("resolve %s -> %s", _args.path, dest)
                    return {path: dest}
                })
            }
        },
    }
}

export let config = create_config()
