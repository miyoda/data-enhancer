
import { quad } from "@rdfjs/data-model";
import { NamedNode, Quad } from "rdf-js";
import { Observable, of } from "rxjs";
import { SearchAllByUriObject } from "../connectors/search-all-by-uri-object";
import { SearchAllByUriSubject } from "../connectors/search-all-by-uri-subject";
import { SearchGeometryIncludingPoint } from "../connectors/search-geometry-including-point";
import { dataEnhancerRdfQry } from "../service/data-enhancer-rdf-service";
import { literalOf, namedNodeOf, quadOf, variableOf } from "../utils/rdf-constructors";

export function searchByCoordinates(latitude: number, longitude: number): Observable<Quad> {
    return dataEnhancerRdfQry(
        coordinates2Rdf(namedNodeOf("dicocot:my-query"), latitude, longitude), 
        {connectors: [
            new SearchGeometryIncludingPoint(),
            new SearchAllByUriSubject(),
            new SearchAllByUriObject([namedNodeOf('owl:sameAs'), namedNodeOf('rdf:type')])
        ]}
    )
}

function coordinates2Rdf(iri: NamedNode, latitude: number, longitude: number): Observable<Quad> {
    return of(
        quadOf(iri, namedNodeOf('wgs84_pos:lat'), literalOf(latitude.toString(), 'xsd:float')), 
        quadOf(iri, namedNodeOf('wgs84_pos:long'), literalOf(longitude.toString(), 'xsd:float'))
    )
}
