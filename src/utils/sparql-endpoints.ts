
export enum SparqlEndpointCompatibility {
    BIF = 'BIF'
}

export interface SparqlEndpoint {
    url: string,
    method: 'GET' | 'POST',
    baseIris: string[],
    compatibleWith?: SparqlEndpointCompatibility[]
}


export var SPARQL_ENDPOINTS: SparqlEndpoint[] = [
    { url: 'https://datos.ign.es/sparql', method: 'GET', baseIris: ['https://datos.ign.es/recurso/'], compatibleWith: [SparqlEndpointCompatibility.BIF] },
    { url: 'https://dbpedia.org/sparql', method: 'GET', baseIris: ['http://dbpedia.org/class/', 'http://dbpedia.org/ontology/'] },
    { url: 'https://es.dbpedia.org/sparql', method: 'GET', baseIris: ['http://es.dbpedia.org/resource/'] },
    { url: 'https://datos.gob.es/virtuoso/sparql', method: 'POST', baseIris: ['http://datos.gob.es/recurso/'] },
]

export function getSparqlEndpointsWithBif() {
    return SPARQL_ENDPOINTS.filter(endpoint => isCompatibleWith(endpoint, SparqlEndpointCompatibility.BIF))
}

function isCompatibleWith(endpoint: SparqlEndpoint, compatibility: SparqlEndpointCompatibility) {
    return endpoint.compatibleWith && endpoint.compatibleWith.indexOf(compatibility) >= 0
}

export function getSparqlEndpointOfIri(iri: string): SparqlEndpoint | undefined {
    return SPARQL_ENDPOINTS.find(sparqlEndpoint => {
        for (let baseIri of sparqlEndpoint.baseIris) {
            if (iri.startsWith(baseIri)) {
                return true
            }
        }
        return false
    })
}