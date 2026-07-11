/**
 * Generates public/facebook-product-feed-*.csv files for Meta Commerce Manager.
 * Requires WOO_KEY and WOO_SECRET in the environment (e.g. from .env locally, Vercel at build time).
 */
import { config } from 'dotenv'
import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env') })

async function main() {
    if (!process.env.WOO_KEY || !process.env.WOO_SECRET) {
        console.error('Missing WOO_KEY or WOO_SECRET environment variables.')
        process.exit(1)
    }

    const { generateFacebookProductFeeds } = await import('../src/lib/feed/facebookProductFeed')

    const feeds = await generateFacebookProductFeeds()
    const outDir = resolve(process.cwd(), 'public')

    mkdirSync(outDir, { recursive: true })

    for (const { locale, filename, csv } of feeds) {
        const outPath = resolve(outDir, filename)
        writeFileSync(outPath, csv, 'utf8')
        const lineCount = csv.split('\n').length - 1
        console.log(`Wrote ${lineCount} product(s) to ${outPath} (${locale})`)
    }
}

main().catch(err => {
    console.error('Failed to generate Facebook product feed:', err)
    process.exit(1)
})
