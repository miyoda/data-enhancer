import { namedNode } from "@rdfjs/data-model";
import { Prefixes } from "n3"

export var RDF_PREFIXES: {[key: string]: string} = {
    'dicocot': 'https://data.dicocot.com/resource/',
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl': 'http://www.w3.org/2002/07/owl#',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'geosparql': 'http://www.opengis.net/ont/geosparql#',
    'wgs84_pos': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
    'ign': 'https://datos.ign.es/recurso/',
    'geonames':  'http://www.geonames.org/ontology#',


    // TODO verify prefixes:
    'ign-btn100': 'https://datos.ign.es/def/btn100#',
    'skos': 'http://www.w3.org/2004/02/skos/core#',
    'units': 'http://dbpedia.org/units/',
    'ssn': 'http://purl.oclc.org/NET/ssnx/ssn#',
    'geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
    'mads': 'http://www.loc.gov/mads/rdf/v1#',
    'bicy': 'http://transporte.linkeddata.es/ontology/',
    'eogupm-ont-geo':  'http://www.oeg-upm.net/ontologies/geo#',
    'doap': 'http://usefulinc.com/ns/doap#',
    'dcterms': 'http://purl.org/dc/terms/',
    'georec': 'https://datos.ign.es/recurso/',
    'prv-types': 'http://purl.org/net/provenance/types#',
    'scovo': 'http://purl.org/NET/scovo#',
    'void': 'http://rdfs.org/ns/void#',
    'dbpedia-ont':  'http://dbpedia.org/ontology/',
    'geoes': 'http://geo.linkeddata.es/ontology/',
    'org': 'http://www.w3.org/ns/org#',
    'ldes-city-ont':  'http://transporte.linkeddata.es/def/City#',
    'ir': 'http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#',
    'gr': 'http://www.heppnetz.de/ontologies/goodrelations/v1#',
    'minetur': 'http://minetur.linkeddata.es/def/ontologiaProductos#',
    'prv': 'http://purl.org/net/provenance/ns#',
    'pheno': 'http://phenomenontology.linkeddata.es/ontology/',
    'meta': 'http://example.org/metadata#'
}

export function prefixes(): Prefixes {
    var prefixes: Prefixes = {}
    Object.keys(RDF_PREFIXES).forEach(key => {
        prefixes[key] = namedNode(RDF_PREFIXES[key])
    });
    return prefixes
}

export function unPrefix(iri: string): string {
    for (let prefix of Object.keys(RDF_PREFIXES)) {
        if (iri.startsWith(prefix + ':')) {
            return RDF_PREFIXES[prefix] + iri.substring(prefix.length+1)
        }
    }
    return iri
}