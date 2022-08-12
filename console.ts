// deno-lint-ignore-file no-explicit-any
/*
    For use:
    - Install deno (https://deno.land/#installation)
    - Run 'deno run --allow-net console.ts'
*/

type Index = [
    string|{
        "dirname": string
        "indices": Index
    }
]

type Gender = {
    "names": string[],
    "type": string|null,
    "presentation": {
        "masc": number,
        "fem": number,
        "andro": number,
        "none": number,
        "custom"?: {
            [presentation_id: string]: {
                "title": string,
                "value": number
            }
        }
    },
    "pronouns": string[]
    "custom"?: {
        [custom_id: string]: {
            "title": string,
            "value": any
        }
    }
}

function printHelp() {
    console.log("=====================")
    console.log("== Gender CLI Help ==")
    console.log("=====================")

    console.log("")

    console.log("--list           |  Lists all registered genders")
    console.log("  alias: -l")

    console.log("")

    console.log("--gender <user>  |  Searches for <user>'s gender")
    console.log("  alias: -g")
}

async function fetchIndex() {
    const content = JSON.parse(await (await fetch("https://gender.olivermakesco.de")).text()) as Index
    console.log(parseIndex(content))
}
function parseIndex(index: Index, indent = 0): string {
    const sub: string[] = []
    let out = ""

    for (const i of index) {
        if (typeof i == "string") {
            if (sub.indexOf(i) == -1) {
                out += "  ".repeat(indent) + i + "\n"
            } 
        } else {
            out += "  ".repeat(indent) + i.dirname + "\n"
            sub.push(i.dirname)
            out += parseIndex(i.indices, indent+1)
        }
    }

    return out
}

async function fetchGender(gender: string) {
    const content = JSON.parse(await (await fetch("https://gender.olivermakesco.de/"+gender)).text()) as Gender
    if (content.type) {
        console.log("Gender type: " + content.type)
    }

    console.log("")

    console.log("Preferred names: " + content.names.join(", "))

    console.log("Pronouns: "+content.pronouns.join(" / "))

    console.log("")

    console.log("Gender presentation:")
    console.log("  " + content.presentation.masc*10 + "% Masculine")
    console.log("  " + content.presentation.fem*10 + "% Feminine")
    console.log("  " + content.presentation.andro*10 + "% Androgynous")
    console.log("  " + content.presentation.andro*10 + "% None")

    if (content.presentation.custom) {
        for (const id in content.presentation.custom) {
            const custom = content.presentation.custom[id]
            console.log("  "+custom.value*10 +"% "+custom.title)
        }
    }

    if (content.custom) {
        console.log("")
        console.log("Custom fields")
        for (const id in content.custom) {
            const custom = content.custom[id]
            console.log("  " + custom.title + ": " + custom.value)
        }
    }
}

if (Deno.args.length == 0) {
    printHelp()
    Deno.exit()
}

if (["-l", "--list"].indexOf(Deno.args[0]) != -1) {
    await fetchIndex()
    Deno.exit()
}

if (["-g", "--gender"].indexOf(Deno.args[0]) != -1) {
    if (Deno.args.length == 1) {
        console.log("No user specified")
        Deno.exit(-1)
    }

    await fetchGender(Deno.args[1])
    Deno.exit()
}

printHelp()