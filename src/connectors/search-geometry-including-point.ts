
import { NamedNode, Quad, Term } from "rdf-js";
import { Observable, of } from "rxjs";
import { defaultIfEmpty, filter, map, mergeMap, tap, throwIfEmpty } from 'rxjs/operators';
import { DataEnhancerRdfConnector, DataEnhancerRdfContext, dataEnhancerRdfQry } from "../service/data-enhancer-rdf-service";
import { multiSparqlQuery, sparqlQuery } from "../service/sparql-service";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { namedNodeOf, quadOf } from "../utils/rdf-constructors";
import { getSparqlEndpointsWithBif } from "../utils/sparql-endpoints";

let wkt = require('wkt')

export class SearchGeometryIncludingPoint implements DataEnhancerRdfConnector {

    enhance = (context: DataEnhancerRdfContext): Observable<Quad> => {
        let quadsLatLong = context.meetAllConditionsNow([
            quad => quad.predicate.equals(namedNodeOf('wgs84_pos:lat')),
            quad => quad.predicate.equals(namedNodeOf('wgs84_pos:long'))
        ])
        if (quadsLatLong == null) {
            return of()
        }
        let lat: number = parseFloat(quadsLatLong[0].object.value)
        let long: number = parseFloat(quadsLatLong[1].object.value)
        
        return multiSparqlQuery(getSparqlEndpointsWithBif(), `
            SELECT ?s ?geo ?type ?geowkt
            WHERE {
                ?s geosparql:hasGeometry ?geo .
                ?geo a ?type .
                ?geo geosparql:asWKT ?geowkt .
                FILTER (bif:GeometryType(?geowkt) = 'MULTIPOLYGON' || bif:GeometryType(?geowkt) = 'POLYGON') .
                FILTER (bif:st_within(?geowkt, bif:st_point(${long}, ${lat}))) .
            }
            LIMIT 100
        `).pipe(
            filter(row => { // TEMPORAL - Force re-filter in order to solve issue with virtuoso bif:st_within
                return booleanPointInPolygon([long, lat], {
                    type: 'Feature',
                    geometry: wkt.parse(row["geowkt"].value),
                    properties: {}
                })
            }),
            tap(row => context.isIriCompleteAndSet((row["geo"].value))),
            mergeMap(row => [
                quadOf(row["s"] as NamedNode, namedNodeOf('geosparql:hasGeometry'), row["geo"] as NamedNode),
                quadOf(row["geo"] as NamedNode, namedNodeOf('rdf:type'), row["type"] as NamedNode),
                quadOf(row["geo"] as NamedNode, namedNodeOf('geosparql:asWKT'), row["geowkt"] as NamedNode)
            ])
        )
    }

}
