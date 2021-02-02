import { searchByCoordinates } from "./qry/coordinates-qry";
import { quadsToNTriples, quadsToTurtle } from "./utils/rdf-converters";
import * as fs from 'fs';

const stream = fs.createWriteStream('./out/result.ttl');

let count = 0;
quadsToNTriples(
    searchByCoordinates(40.36742595009149, -3.6125209663361244),
    stream
)
