
export default [
    {
        input: 'lib/client/index.js',
        output: {
            file: `lib/controllers/static/pinstripe.js`,
            format: 'iife',
            name: 'Pinstripe',
            sourcemap: true
        }
    }
]
