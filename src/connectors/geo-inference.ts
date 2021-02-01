
import { Quad } from "rdf-js";
import { Observable, of } from "rxjs";
import { DataEnhancerRdfConnector, DataEnhancerRdfContext, dataEnhancerRdfQry } from "../service/data-enhancer-rdf-service";

export class GeoInferences implements DataEnhancerRdfConnector {

    enhance = (newQuad: Quad, context: DataEnhancerRdfContext) => {
        // TODO if (?x0 wgs84_pos:lat ?x1 & ?x0 wgs84_pos:long ?x2) then (x?1 hasGeo ?x2 & ?x2 type Point & ?x2 geowkt POINT)
        // TODO other using owl:equivalentClass wl:equivalentProperty ... https://docs.cambridgesemantics.com/anzograph/v2.2/userdoc/inferences.htm
        return of<Quad>()
    }

}
