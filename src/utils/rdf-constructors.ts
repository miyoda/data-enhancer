import { namedNode, quad, variable } from "@rdfjs/data-model";
import { BaseQuad, Quad } from "rdf-js";
import { unPrefix } from "./rdf-prefixes";

export function quadOf(
    subject: Quad['subject'], predicate: Quad['predicate'], object: Quad['object'], graph?: Quad['graph']
) {
    return quad<Quad>(subject, predicate, object, graph)
}

export function namedNodeOf<Iri extends string = string>(iri: Iri) {
    return namedNode(unPrefix(iri))
}

export function variableOf(value: string) {
    return variable(value)
}

