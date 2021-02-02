import { searchByCoordinates } from "./qry/coordinates-qry";
import { quadsFormat } from "./utils/rdf-converters";
import express from "express";
import cors from "cors";
import { prefixes } from "./utils/rdf-prefixes";
import { Request, Response } from 'express'
import { setLogLevel } from "./utils/logging-utils";

export const app = express();
const port = 8080; // default port to listen

app.use(cors())

app.get( "/prefixes", ( req, res ) => {
    res.send(prefixes())
} )


app.get( "/stream/coordinates", ( req: Request, res: Response ) => {
    let latitude = parseFloat(req.query.latitude as string);
    let longitude = parseFloat(req.query.longitude as string);

    quadsFormat( 
        searchByCoordinates(latitude, longitude),
        eventStreamIn(res),
        'N-Triples' // '' (turtle), 'N-Triples', 'text/n3'
    )
} )

function eventStreamIn(res: Response) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();
    return {
        write: (chunk: string, encoding: string, done: ()=>void) => { 
            res.write(`data: ${chunk}\n\n`)
            console.debug('WRITE ', chunk) 
            done && done()
        },
        end: (done: ()=>void) => {
            res.write(`data: CLOSE\n\n`)
            console.debug('CLOSE', done) 
            done && done()
        }
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

setLogLevel('INFO')