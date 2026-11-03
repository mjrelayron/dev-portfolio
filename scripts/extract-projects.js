import fs from 'fs';
import path from 'path';

const projectsFile = path.join(process.cwd(), 'src', 'data', 'projects.js');
const outputFile = path.join(process.cwd(), 'api', 'project-data.json');

try {
    let content = fs.readFileSync(projectsFile, 'utf8');

    // 1. Remove imports
    content = content.replace(/import .*?;/g, '');

    // 2. Remove asset references (e.g., websiteAssets.foo, projectAssets.bar)
    // We'll replace them with placeholder strings so JSON.parse doesn't fail
    content = content.replace(/websiteAssets\.\w+/g, '"[Asset]"');
    content = content.replace(/projectAssets\.\w+(\.\w+)?/g, '"[Asset]"');

    // 3. Remove buildLinks function call and just keep the object
    // This is tricky. buildLinks({...}) -> {...}
    // Let's just replace `buildLinks({` with `{` and hope the closing `})` matches `}`
    // Actually, simpler: Regex to extract the array content directly might be hard.

    // Alternative: Use a regex to find the arrays
    const featuredMatch = content.match(/export const featuredProjects = (\[[\s\S]*?\]);/);
    const otherMatch = content.match(/export const otherProjects = (\[[\s\S]*?\]);/);

    if (!featuredMatch || !otherMatch) {
        throw new Error("Could not find project arrays");
    }

    let featuredRaw = featuredMatch[1];
    let otherRaw = otherMatch[1];

    // Clean up the raw strings to be valid JSON
    // 1. Quote unquoted keys (id:, title:, etc.)
    const quoteKeys = (str) => str.replace(/(\w+):/g, '"$1":');

    // 2. Remove trailing commas
    const removeTrailingCommas = (str) => str.replace(/,(\s*[}\]])/g, '$1');

    // 3. Handle the buildLinks function calls specifically in the string
    // links: buildLinks({ ... }) -> links: { ... }
    const cleanLinks = (str) => str.replace(/buildLinks\s*\(\s*({[\s\S]*?})\s*\)/g, '$1');

    // 4. Replace single quotes with double quotes (carefully)
    // This is prone to error if text contains quotes.
    // Better approach: Evaluate the cleaned string as JS? 
    // Since we removed imports and assets, maybe we can `eval` it?

    // Let's try `eval` after mocking the missing variables.
    // This is risky but effective for a build script.

    const mockAssets = new Proxy({}, { get: () => "Asset" });
    const websiteAssets = mockAssets;
    const projectAssets = mockAssets;
    const socialMediaAssets = mockAssets;
    const placeholderAssets = mockAssets;

    const buildLinks = (obj) => obj;

    // We need to execute the extracted code.
    // Let's construct a runnable script string.
    const runnable = `
    const websiteAssets = new Proxy({}, { get: () => "Asset" });
    const projectAssets = new Proxy({}, { get: () => "Asset" });
    const socialMediaAssets = new Proxy({}, { get: () => "Asset" });
    const placeholderAssets = new Proxy({}, { get: () => "Asset" });
    const buildLinks = (obj) => obj;
    
    ${featuredMatch[0].replace('export ', '')}
    ${otherMatch[0].replace('export ', '')}
    
    console.log(JSON.stringify({ featuredProjects, otherProjects }, null, 2));
  `;

    // Write to a temp file and run it
    fs.writeFileSync('scripts/dev/temp-extract.js', runnable);

} catch (err) {
    console.error("Error preparing script:", err);
}
