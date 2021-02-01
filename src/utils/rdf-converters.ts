import { Writer } from "n3"
import { Quad } from "rdf-js";
import { Observable } from "rxjs";
import { RDF_PREFIXES } from "./rdf-prefixes"

export function quadsToTurtle(quads: Observable<Quad>, outputStream?: any){
    const writer = new Writer(outputStream || process.stdout, { prefixes: RDF_PREFIXES});
    quads.subscribe(
        quad => writer.addQuad(quad),
        err => console.error('ERROR', err),
        () =>  writer.end((error, result) => console.log(result))
    )
    return writer
}