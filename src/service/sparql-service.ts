import { Quad, Quad_Object, Quad_Predicate, Term } from "rdf-js";
import { from, Observable, of } from "rxjs";
import { RDF_PREFIXES } from "../utils/rdf-prefixes";
import StreamClient from "sparql-http-client";
import { Readable } from 'stream';
import { getSparqlEndpointOfIri, SparqlEndpoint } from "../utils/sparql-endpoints";
import { map, mergeMap, throwIfEmpty } from "rxjs/operators";
import { namedNodeOf, quadOf } from "../utils/rdf-constructors";

export function sparqlQuery(endpoint: SparqlEndpoint, query: string): Observable<{[key: string]: Term}> {
    return multiSparqlQuery([endpoint], query)
}

export function multiSparqlQuery(endpoints: SparqlEndpoint[], query: string): Observable<{[key: string]: Term}> {
    const finalQuery = prefixesOfQuery() + '\n' + query
    console.log(`SPARQL QUERY to ${endpoints.map(e => e.url).join(' & ')}: \n${query}`)
    return from(endpoints).pipe(
            mergeMap(endpoint => _query(endpoint, finalQuery))
        );
}

export function sparqlQueryAllOfIri(iri: string): Observable<Quad> {
    let sparqlEndpoint = getSparqlEndpointOfIri(iri)
    if (sparqlEndpoint == null) return of()

   return sparqlQuery(sparqlEndpoint, `
        SELECT ?p ?o
        WHERE {
            <${iri}> ?p ?o .
        }
        LIMIT 100
    `).pipe(
        //throwIfEmpty(() => new Error("Iri not found " + iri)),
        map(row => quadOf(namedNodeOf(iri), row['p'] as Quad_Predicate, row['o'] as Quad_Object))
    )
}

function _query(endpoint: SparqlEndpoint, query: string): Observable<{[key: string]: Term}> {
    return new Observable((observer) => {
        new StreamClient({
            endpointUrl: endpoint.url
        }).query.select(query)
            .then((stream: Readable) => { stream
                .on('data', (row: { [key: string]: Term; }) => observer.next(row))
                .on('error', observer.error)
                .on('end', () => observer.complete())
            })
    })
}

function prefixesOfQuery(): string {
    return Object.keys(RDF_PREFIXES)
        .map(prefixKey => `PREFIX ${prefixKey}: <${RDF_PREFIXES[prefixKey]}>`)
        .join('\n')
}