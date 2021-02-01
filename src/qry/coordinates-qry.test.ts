import { searchByCoordinates } from "./coordinates-qry";


test('basic searchByCoordinates', done => {
    let result = []
    searchByCoordinates(40.36742595009149, -3.6125209663361244)
        .subscribe(
            res => {
                //console.info('NEXT', res)
                result.push(res)
            },
            err => {
                fail(err)
            },
            () => {
                expect(result.length).toBe(191)
                done()
            }
        )
}, 10000)
