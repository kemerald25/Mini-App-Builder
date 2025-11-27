#!/usr/bin/env node
import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MiniAppGenerator } from './generator/index.js';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}
async function collectConfig() {
    console.log('🚀 Mini App Builder - CLI Mode\n');
    const name = await question('Mini App Name: ');
    const description = await question('Description: ');
    console.log('\nCategory options:');
    console.log('1. social');
    console.log('2. gaming');
    console.log('3. defi');
    console.log('4. utility');
    const categoryChoice = await question('Select category (1-4, default: 1): ');
    const categories = ['social', 'gaming', 'defi', 'utility'];
    const category = categories[parseInt(categoryChoice) - 1] || 'social';
    const homeUrl = await question('Home URL (e.g., https://your-miniapp.com): ');
    const features = [];
    console.log('\nEnter features (press Enter with empty line to finish):');
    while (true) {
        const feature = await question('Feature: ');
        if (!feature.trim())
            break;
        features.push(feature);
    }
    const needsTransaction = (await question('Needs transaction support? (y/n, default: n): ')).toLowerCase() === 'y';
    const needsAgent = (await question('Needs agent integration? (y/n, default: n): ')).toLowerCase() === 'y';
    let agentAddress;
    if (needsAgent) {
        agentAddress = await question('Agent address (0x...): ');
    }
    return {
        name: name || 'My Mini App',
        description: description || 'A Base Mini App',
        category: category,
        features: features.length > 0 ? features : ['Feature 1', 'Feature 2'],
        needsTransaction,
        needsAgent,
        homeUrl: homeUrl || 'https://example.com',
        agentAddress,
    };
}
async function main() {
    try {
        const config = await collectConfig();
        console.log('\n📦 Generating Mini App...');
        const outputDir = path.join(process.cwd(), config.name.toLowerCase().replace(/\s+/g, '-'));
        // Check if directory exists
        try {
            await fs.access(outputDir);
            const overwrite = await question(`\nDirectory "${outputDir}" already exists. Overwrite? (y/n): `);
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Cancelled.');
                rl.close();
                return;
            }
            await fs.rm(outputDir, { recursive: true });
        }
        catch {
            // Directory doesn't exist, proceed
        }
        await fs.mkdir(outputDir, { recursive: true });
        const generator = new MiniAppGenerator(config);
        await generator.writeFiles(outputDir);
        // Display DEV ROYALE branding
        console.log('\n');
        console.log('╔════════════════════════════════════╗');
        console.log('║                                    ║');
        console.log('║           DEV ROYALE                ║');
        console.log('║                                    ║');
        console.log('╚════════════════════════════════════╝');
        console.log('\n✅ Mini App generated successfully!');
        console.log(`\n📁 Output directory: ${outputDir}`);
        console.log('\n📝 Next steps:');
        console.log(`  1. cd ${path.basename(outputDir)}`);
        console.log('  2. cp .env.example .env.local');
        console.log('  3. Add your NEXT_PUBLIC_ONCHAINKIT_API_KEY to .env.local');
        console.log('  4. npm install');
        console.log('  5. npm run dev');
        console.log('\n');
        rl.close();
    }
    catch (error) {
        console.error('❌ Error:', error);
        rl.close();
        process.exit(1);
    }
}
main();
