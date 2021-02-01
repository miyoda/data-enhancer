import { Quad } from "rdf-js";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { defaultIfEmpty, filter, map, mergeMap, tap, throwIfEmpty } from 'rxjs/operators';

export function dataEnhancerRdfQry(input: Observable<Quad>, options: DataEnhancerRdfOptions): Observable<Quad> {
    return dataEnhancerRdfInContext(input, options, new DataEnhancerRdfContext())
}

export interface DataEnhancerRdfOptions {
    connectors: DataEnhancerRdfConnector[]
}

export interface DataEnhancerRdfConnector {
    enhance: (context: DataEnhancerRdfContext) => Observable<Quad>
}


export interface DataEnhancerRdfInference {

}

export class DataEnhancerRdfContext {
    
    private quads: Quad[] = []
    private completedIris: string[] = []

    constructor() {

    }

    containsQuad = (queryQuad: Quad) => {
        return this.quads.indexOf(queryQuad) < 0
    }
    
    addQuad = (newQuad: Quad) => {
        return this.quads.push(newQuad)
    }

    isIriCompleteAndSet = (iri: string) => {
        const isPresent = this.completedIris.indexOf(iri) >= 0
        if (!isPresent) this.completedIris.push(iri)
        return isPresent
    }
    
    getLastQuad = () => this.quads[this.quads.length - 1]

    getPreviousQuads = () => this.quads.slice(0, this.quads.length-1)

    meetAConditionNow = (condition: (quad: Quad) => boolean) => {
        let res = this.meetAllConditionsNow([condition])
        return res == null ? null : res[0]
    }

    meetAConditionPreviously = (condition: (quad: Quad) => boolean) => {
        let res = this.meetAllConditionsPreviously([condition])
        return res == null ? null : res[0]
    }

    meetAllConditionsNow = (conditions: ((quad: Quad) => boolean)[]) => {
        let conditionQuads: Quad[] = []
        let missingConditions: (((quad: Quad) => boolean) | null)[] = [...conditions]
        let last = this.getLastQuad()

        let idx = this.indexOfMeetACondition(missingConditions, last)
        if (idx != -1) {
            missingConditions[idx] = null
            conditionQuads[idx] = last
            if (this.hasAllNulls(missingConditions)) return conditionQuads
            let previousConditionQuads = this.meetAllConditionsInQuads(missingConditions, this.getPreviousQuads())
            if (previousConditionQuads == null) return null
            for (let i in previousConditionQuads) {
                if (previousConditionQuads[i] != null) {
                    conditionQuads[i] = previousConditionQuads[i]
                }
            }
            return conditionQuads
        }
        return null
    }

    meetAllConditionsPreviously = (conditions: ((quad: Quad) => boolean)[]) => {
        return this.meetAllConditionsInQuads(conditions, this.getPreviousQuads())
    }
    
    private meetAllConditionsInQuads = (conditions: (((quad: Quad) => boolean) | null)[], quads: Quad[]) => {
        let conditionQuads: Quad[] = []
        let missingConditions: (((quad: Quad) => boolean) | null)[] = [...conditions]

        for (let quad of quads) {
            let idx = this.indexOfMeetACondition(missingConditions, quad)
            if (idx != -1) {
                missingConditions[idx] = null
                conditionQuads[idx] = quad
                if (this.hasAllNulls(missingConditions)) return conditionQuads
            }
        }
        return null
    }

    private hasAllNulls(arr: any[]): boolean {
        return arr.find(element => element != null) == null
    }

    private indexOfMeetACondition = (conditions: (((quad: Quad) => boolean) | null)[], quad: Quad) => {
        for (let i = 0; i<conditions.length; i++) {
            if (conditions[i] != null && conditions[i]!!(quad)) {
                return i
            }
        }
        return -1
    }
    
}

function dataEnhancerRdfInContext(newQuads: Observable<Quad>, options: DataEnhancerRdfOptions, context: DataEnhancerRdfContext): Observable<Quad> {
    return new Observable((observer) => {
        newQuads.pipe(mergeMap((newQuad: Quad) => {
            if (context.containsQuad(newQuad)) {
                context.addQuad(newQuad)
                observer.next(newQuad)
                return dataEnhancerRdfInContext(searchConnections(options, context), options, context)
                    .forEach((q: Quad) => {
                        observer.next(q)
                    })
            } else {
                return of()
            }
        })).toPromise()
            .then(() => observer.complete())
            .catch((err) => observer.error(err))
    })
}

function searchConnections(options: DataEnhancerRdfOptions, context: DataEnhancerRdfContext): Observable<Quad> {
    return of(...options.connectors).pipe(
        mergeMap(connector => connector.enhance(context))
    )
}
