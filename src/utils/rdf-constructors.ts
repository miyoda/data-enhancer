import { literal, namedNode, quad, variable } from "@rdfjs/data-model";
import { NamedNode } from "n3";
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

export function literalOf(value: string, datatype: string) {
    return literal(value, namedNodeOf(datatype))
}

