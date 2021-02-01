import { unPrefix } from "./rdf-prefixes"

test('unprefix', done => {
    let result = []
    expect(unPrefix('owl:sameAs')).toBe('http://www.w3.org/2002/07/owl#sameAs')
    expect(unPrefix('http://www.w3.org/2002/07/owl#sameAs')).toBe('http://www.w3.org/2002/07/owl#sameAs')
    done()
})

