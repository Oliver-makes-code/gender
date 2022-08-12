import { serve } from "https://deno.land/std@0.152.0/http/server.ts"

async function indexDirectory(pathname: string): Promise<(object|string)[]> {
    const out: (object|string)[] = []

    const contents = Deno.readDir(pathname)
    for await (const item of contents) {
        if (item.isDirectory) {
            const inner = await indexDirectory(pathname + "/" + item.name)
            out.push({ dirname: item.name, indices: inner })
        } else {
            out.push(item.name.slice(0, -5))
        }
    }

    return out
}

serve(async (req,) => {
    const loc = new URL(req.url).pathname.toLowerCase()

    if (loc == "/") {
        return Response.json(await indexDirectory("./genders"))
    }

    return Response.json(JSON.parse(await Deno.readTextFile("./genders" + loc + ".json")))
})