/**
 * Generates public/facebook-product-feed.csv for Meta Commerce Manager.
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

    const { generateFacebookProductFeedCsv } = await import('../src/lib/feed/facebookProductFeed')

    const csv = await generateFacebookProductFeedCsv()
    const outDir = resolve(process.cwd(), 'public')
    const outPath = resolve(outDir, 'facebook-product-feed.csv')

    mkdirSync(outDir, { recursive: true })
    writeFileSync(outPath, csv, 'utf8')

    const lineCount = csv.split('\n').length - 1
    console.log(`Wrote ${lineCount} product(s) to ${outPath}`)
}

main().catch(err => {
    console.error('Failed to generate Facebook product feed:', err)
    process.exit(1)
})
