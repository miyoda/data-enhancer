
import { Quad } from "rdf-js";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { namedNodeOf, quadOf } from "../utils/rdf-constructors";
import { DataEnhancerRdfConnector, DataEnhancerRdfContext, dataEnhancerRdfQry } from "./data-enhancer-rdf-service";

let input0 = quadOf(namedNodeOf("subject0"), namedNodeOf("predicate0"), namedNodeOf("object0"));
let input1 = quadOf(namedNodeOf("subject1"), namedNodeOf("predicate1"), namedNodeOf("object1"));
let output0A = quadOf(namedNodeOf("subject0A"), namedNodeOf("predicate0A"), namedNodeOf("object0A"));
let output1A = quadOf(namedNodeOf("subject1A"), namedNodeOf("predicate1A"), namedNodeOf("object1A"));
let outputB = quadOf(namedNodeOf("subjectB"), namedNodeOf("predicateB"), namedNodeOf("objectB"));

let connectorA: DataEnhancerRdfConnector = {
    enhance: (context: DataEnhancerRdfContext): Observable<Quad> => {
        if (context.meetAConditionNow(quad => quad.equals(input0)) != null) {
            return of(output0A).pipe(delay(10))
        } else if (context.meetAConditionNow(quad => quad.equals(input1)) != null) {
            return of(output1A).pipe(delay(10))
        } else {
            return of()
        }
    }
}

let connectorB: DataEnhancerRdfConnector = {
    enhance: (context: DataEnhancerRdfContext): Observable<Quad> => {
        if (context.meetAllConditionsNow([quad => quad.equals(output0A), quad => quad.equals(output1A)]) != null) {
            return of(outputB).pipe(delay(10))
        } else {
            return of()
        }
    }
}

test('only1', done => {
    let expectedResponse = [
        input0, 
        output0A
    ]
    dataEnhancerRdfQry(of(input0), {connectors: [
        connectorA, connectorB
    ]}).subscribe({
            next: responseQuad => {
                let idx = expectedResponse.indexOf(responseQuad)
                expect(idx).toBeGreaterThanOrEqual(0)
                expectedResponse.splice(idx, 1)
            },
            complete: () => {
                expect(expectedResponse).toStrictEqual([])
                done()
            },
        })
});

test('order1', done => {
    let expectedResponse = [
        input0, input1, 
        output0A, output1A,
        outputB
    ]
    dataEnhancerRdfQry(of(input0, input1), {connectors: [
        connectorA, connectorB
    ]}).subscribe({
            next: responseQuad => {
                let idx = expectedResponse.indexOf(responseQuad)
                expect(idx).toBeGreaterThanOrEqual(0)
                expectedResponse.splice(idx, 1)
            },
            complete: () => {
                expect(expectedResponse).toStrictEqual([])
                done()
            },
        })
});

test('order2', done => {
    let expectedResponse = [
        input0, input1, 
        output0A, output1A,
        outputB
    ]
    dataEnhancerRdfQry(of(input1, input0), {connectors: [
        connectorA, connectorB
    ]}).subscribe({
            next: responseQuad => {
                let idx = expectedResponse.indexOf(responseQuad)
                expect(idx).toBeGreaterThanOrEqual(0)
                expectedResponse.splice(idx, 1)
            },
            complete: () => {
                expect(expectedResponse).toStrictEqual([])
                done()
            },
        })
});