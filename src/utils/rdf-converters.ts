import { Writer } from "n3"
import { Quad } from "rdf-js";
import { Observable } from "rxjs";
import { RDF_PREFIXES } from "./rdf-prefixes"

export function quadsFormat(quads: Observable<Quad>, outputStream?: any, format?: string){
    const writer = new Writer(outputStream || process.stdout, { prefixes: RDF_PREFIXES, format});
    quads.subscribe(
        quad => {
            //console.log('QUAD', quad)
            writer.addQuad(quad)
        },
        err => console.error('ERROR', err),
        () =>  writer.end((error, result) => console.log(result))
    )
    return writer

}

export function quadsToTurtle(quads: Observable<Quad>, outputStream?: any){
    return quadsFormat(quads, outputStream, '')
}

export function quadsToNTriples(quads: Observable<Quad>, outputStream?: any){
    return quadsFormat(quads, outputStream, 'N-Triples')
}

export function quadsToN3(quads: Observable<Quad>, outputStream?: any){
    return quadsFormat(quads, outputStream, 'text/n3')
}