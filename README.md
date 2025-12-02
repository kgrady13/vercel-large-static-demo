# Vercel Large Static Demo

Deploy a large static site (22,000 files) to Vercel using `--archive=tgz`.

## Deploy

Generates 22k HTML/JS files and deploys with archive compression:

```bash
npm run deploy
```

This uses the [`--archive=tgz`](https://vercel.com/docs/cli/deploy#archive) flag to compress files before uploading, avoiding rate limits when deploying thousands of files.
