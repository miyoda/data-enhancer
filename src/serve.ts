import { searchByCoordinates } from "./qry/coordinates-qry";
import { quadsFormat } from "./utils/rdf-converters";
import express from "express";
import cors from "cors";
import { prefixes, RDF_PREFIXES } from "./utils/rdf-prefixes";

export const app = express();
const port = 8080; // default port to listen

app.use(cors())

app.get( "/prefixes", ( req, res ) => {
    res.send(prefixes())
} )


app.get( "/stream/coordinates", ( req, res ) => {
    let latitude = parseFloat(req.query.latitude as string);
    let longitude = parseFloat(req.query.longitude as string);

    quadsFormat( 
        searchByCoordinates(latitude, longitude),
        eventStreamIn(res),
        'N-Triples' // '' (turtle), 'N-Triples', 'text/n3'
    )
} )

function eventStreamIn(res: any) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();
    return {
        write: (chunk: string, encoding: string, done: ()=>void) => { res.write(`data: ${chunk}\n`); done && done(); },
        end: (done: ()=>void) => { res.end(); done && done(); }
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})