
import { NamedNode, Quad, Quad_Object, Quad_Predicate, Term } from "rdf-js";
import { Observable, of } from "rxjs";
import { defaultIfEmpty, filter, map, mergeMap, tap, throwIfEmpty } from 'rxjs/operators';
import { DataEnhancerRdfConnector, DataEnhancerRdfContext, dataEnhancerRdfQry } from "../service/data-enhancer-rdf-service";
import { sparqlQuery, sparqlQueryAllOfIri } from "../service/sparql-service";
import { FeatureCollection, GeoJSONObject, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { getSparqlEndpointOfIri } from "../utils/sparql-endpoints";

let wkt = require('wkt')

export class SearchAllByUriSubject implements DataEnhancerRdfConnector {

    enhance = (context: DataEnhancerRdfContext): Observable<Quad> => {
        let iriQuad = context.meetAConditionNow(
            quad => quad.subject.termType == 'NamedNode',
        )
        if (iriQuad == null) return of()

        let iri: string = iriQuad.subject.value

        if (context.isIriCompleteAndSet(iri)) return of()
        
        return sparqlQueryAllOfIri(iri)
    }

}
