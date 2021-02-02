import { NamedNode, Quad, Quad_Object, Quad_Predicate, Term } from "rdf-js";
import { Observable, of } from "rxjs";
import { defaultIfEmpty, delay, filter, map, mergeMap, tap, throwIfEmpty } from 'rxjs/operators';
import { DataEnhancerRdfConnector, DataEnhancerRdfContext, dataEnhancerRdfQry } from "../service/data-enhancer-rdf-service";
import { sparqlQueryAllOfIri } from "../service/sparql-service";
import { FeatureCollection, GeoJSONObject, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { getSparqlEndpointOfIri } from "../utils/sparql-endpoints";

let wkt = require('wkt')

export class SearchAllByUriObject implements DataEnhancerRdfConnector {

    constructor(private validPredicates: NamedNode[]) {

    }

    enhance = (context: DataEnhancerRdfContext): Observable<Quad> => {
        const validPredicates = this.validPredicates
        let iriQuad = context.meetAConditionNow(
            quad => validPredicates.find(validPredicate => validPredicate.equals(quad.predicate)) != null
        )
        if (iriQuad == null) return of()

        let iri: string = iriQuad.object.value
        if (context.isIriCompleteAndSet(iri)) return of()
        
        return sparqlQueryAllOfIri(iri).pipe(
            delay(5000) // TODO mahernandez
        )
    }

}
