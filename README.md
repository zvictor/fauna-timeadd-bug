Note: for a better experience, there is also an [alternative reproducible using brainyduck](https://github.com/zvictor/fauna-timeadd-bug/tree/main).
# Steps to reproduce

1. Run the commands below to set everything up (**Remember to replace `<YOUR_FAUNA_SECRET_HERE>` inside `curl`!**):
```haskell
npx fauna-shell upload-graphql-schema Schema.gql

npx fauna-shell eval --file=shell.fql

curl 'https://graphql.fauna.com/graphql' \
  -H 'authority: graphql.fauna.com' \
  -H 'authorization: Basic <YOUR_FAUNA_SECRET_HERE>' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  --data-raw '{"operationName":null,"variables":{},"query":"mutation {\n  A: createCrawlingQuery(\n    data: {keyword: \"A-graphql\", schedule: {amount: 24, unit: hours}}\n  ) {\n    _id\n  }\n  B: createCrawlingQuery(data: {keyword: \"B-graphql\", schedule: {amount: 24, unit: days}}) {\n    _id\n  }\n  C: createCrawlingQuery(\n    data: {keyword: \"C-graphql\", schedule: {amount: 24, unit: minutes}, executions: [\"2022-10-25T10:50:22.937Z\"]}\n  ) {\n    _id\n  }\n}\n"}'
```
2. Run the code below in the shell and notice that only the 3 first results contain `Time` as result, the rest have `null`. **The correct would be for all entries to have a `Time` instead of `null`**.
```haskell
> Paginate(Match(Index("by_expiry")))

{
  data: [
    [
      Time("1970-01-02T00:00:00Z"),
      Ref(Collection("CrawlingQuery"), "346488475199996497")
    ],
    [
      Time("1970-01-25T00:00:00Z"),
      Ref(Collection("CrawlingQuery"), "346488475469480529")
    ],
    [
      Time("2022-10-25T11:30:50.134803Z"),
      Ref(Collection("CrawlingQuery"), "346488475705410129")
    ],
    [ null, Ref(Collection("CrawlingQuery"), "346488604317450825") ],
    [ null, Ref(Collection("CrawlingQuery"), "346488604336325193") ],
    [ null, Ref(Collection("CrawlingQuery"), "346488604336326217") ]
  ]
}
```
3. To make sure we created the data correctly, run the code below in the shell. You will notice how all documents have the same data types and same structure.
```haskell
> Map(
  Paginate(Documents(Collection('CrawlingQuery'))),
  Lambda('ref', Get(Var('ref')))
)

{
  data: [
    {
      ref: Ref(Collection("CrawlingQuery"), "346488475199996497"),
      ts: 1666696009750000,
      data: { keyword: 'A-shell', schedule: { amount: 24, unit: 'hours' } }
    },
    {
      ref: Ref(Collection("CrawlingQuery"), "346488475469480529"),
      ts: 1666696009990000,
      data: { keyword: 'B-shell', schedule: { amount: 24, unit: 'days' } }
    },
    {
      ref: Ref(Collection("CrawlingQuery"), "346488475705410129"),
      ts: 1666696010212000,
      data: {
        keyword: 'C-shell',
        schedule: { amount: 24, unit: 'minutes' },
        executions: [ Time("2022-10-25T11:06:50.134803Z") ]
      }
    },
    {
      ref: Ref(Collection("CrawlingQuery"), "346488604317450825"),
      ts: 1666696132880000,
      data: {
        keyword: 'C-graphql',
        schedule: { amount: 24, unit: 'minutes' },
        executions: [ Time("2022-10-25T10:50:22.937Z") ]
      }
    },
    {
      ref: Ref(Collection("CrawlingQuery"), "346488604336325193"),
      ts: 1666696132880000,
      data: { keyword: 'A-graphql', schedule: { amount: 24, unit: 'hours' } }
    },
    {
      ref: Ref(Collection("CrawlingQuery"), "346488604336326217"),
      ts: 1666696132880000,
      data: { keyword: 'B-graphql', schedule: { amount: 24, unit: 'days' } }
    }
  ]
}
```