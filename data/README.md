# DinoBase Modular Data Catalog

DinoBase now loads genus records from modular JavaScript data parts listed in
`DINOBASE.dataModules`.

Each module calls `DINOBASE.registerDataPart({ id, description, dinosaurs })`.
After all modules load, `DINOBASE.mergeDataParts()` appends only new records by
`id`, then rebuilds indexes for search, filters, timeline, compare, and detail
pages.

## Why Modular

There is no single official canonical list of all non-avian dinosaur genera.
Public genus lists include valid genera alongside junior synonyms, doubtful
names, unpublished names, and taxa later found not to be dinosaurs. For a
production educational catalog, new modules should be added in vetted batches
with a review status rather than dumped into one giant file.

## Record Shape

Keep each dinosaur compatible with the original `data.js` schema:

- `id`
- `name.scientific`
- `name.common`
- `pronunciation`
- `meaningOfName`
- `period`
- `classification`
- `diet`
- `measurements.length`
- `measurements.height`
- `measurements.weight`
- `habitat`
- `fossilLocations`
- `discovery`
- `behavior`
- `funFacts`

Use `null` for uncertain numeric measurements instead of inventing exact
values. The UI renders uncertain measurements as unavailable.
