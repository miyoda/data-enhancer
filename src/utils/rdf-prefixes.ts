
export var RDF_PREFIXES: {[key: string]: string} = {
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl': 'http://www.w3.org/2002/07/owl#',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'geosparql': 'http://www.opengis.net/ont/geosparql#',
    'wgs84_pos': 'http://www.w3.org/2003/01/geo/wgs84_pos#'
}


export function unPrefix(iri: string): string {
    for (let prefix of Object.keys(RDF_PREFIXES)) {
        if (iri.startsWith(prefix + ':')) {
            return RDF_PREFIXES[prefix] + iri.substring(prefix.length+1)
        }
    }
    return iri
}