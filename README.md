# Steps to reproduce

```bash
npm i
export FAUNA_SECRET=<secret-of-a-new-db>
npx brainyduck --no-watch dev
ts-node src/index.ts
```

Please note that you can add `--overwrite` to the brainyduck command in order to "reset" fauna.