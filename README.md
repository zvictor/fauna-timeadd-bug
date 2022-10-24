# Steps to reproduce

1. Run the commands below:
```bash
npm i
export FAUNA_SECRET=<secret-of-a-new-db>
npx brainyduck --no-watch dev
ts-node src/index.ts
```
2. Read the output of the last command.
3. Check the indexes `by_expiry` and `by_expiry_hardcoded` on fauna's dashboard. They should both have a `Time` as first value, but `by_expiry` has `null` instead.

**Tips to debug the code:**

* You can add `--overwrite` to the brainyduck commands in order to "reset" fauna.

* Removing the `--no-watch` option is also helpful while debugging to speed up interactions.

# Expected output

The snippet below is the output I get when running the steps on my machine.

Notice that `by_expiry` and `by_expiry_hardcoded` were supposed to have returned the same values, but they didn't.

```haskell
========== TESTING INDEX 'by_expiry' ==========

If the code works as it should, you will see a collection with keywords A and B.
But if you see and empty array, the code is not working as it should!

by_expiry: []


========== TESTING INDEX 'by_expiry_hardcoded' ==========

If the code works as it should, you will see a collection with keywords A and B.
But if you see and empty array, the code is not working as it should!

by_expiry_hardcoded: [
  {
    executions: [],
    _id: '346435617686553163',
    keyword: 'A',
    schedule: { amount: 24, unit: 'hours' },
    _ts: 1666645600880000
  },
  {
    executions: [],
    _id: '346435618099692107',
    keyword: 'B',
    schedule: { amount: 24, unit: 'days' },
    _ts: 1666645601275000
  }
]
```
