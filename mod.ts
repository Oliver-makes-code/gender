import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

serve(async (req, inf) => {
    return new Response(
        await Deno.readTextFile(
            "./genders" + req.url.substring(req.url.indexOf("/",8)) + ".json"
        ),
        {
            "headers": {
                "content-type": "text/json"
            }
        }
    )
})