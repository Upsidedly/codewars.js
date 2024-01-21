// eslint-disable-next-line import/no-extraneous-dependencies
import dts from 'bun-plugin-dts'

// eslint-disable-next-line no-undef
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  plugins: [dts()],
  target: 'node'
})