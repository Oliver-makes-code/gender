import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

serve(async (req) => {
    return Response.json(
        await Deno.readTextFile(
            "./genders" + req.url.substring(req.url.indexOf("/",8)) + ".json"
        )
    )
})