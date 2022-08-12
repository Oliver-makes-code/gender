import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

async function readAllInDir(pathname: string, addendum?: string): Promise<string[]> {
    const out: string[] = []
    const files = Deno.readDir(pathname)
    for await (const file of files) {
        if (file.isDirectory) {
            const newAddendum = addendum? file.name+"/"+addendum: file.name
            out.push(...await readAllInDir(pathname + "/" + file.name, newAddendum))
            continue
        }
        const name = file.name.substring(0, file.name.lastIndexOf("."))
        out.push("/" + (addendum? addendum + "/": "") + name)
    }
    return out
}

serve(async (req,) => {
    const loc = new URL(req.url).pathname;
    if (loc == "/") {
        const out = await readAllInDir("./genders");
        return Response.json(out)
    }
    return Response.json(JSON.parse(await Deno.readTextFile("./genders" + loc + ".json")))
})