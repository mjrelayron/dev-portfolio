import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Function to convert images to WebP
async function convertToWebP(inputDir, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all image files recursively
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
          fileList.push(filePath);
        }
      }
    });
    
    return fileList;
  }

  const imageFiles = getAllFiles(inputDir);
  
  console.log(`Found ${imageFiles.length} images to convert in ${inputDir}`);
  
  for (const imagePath of imageFiles) {
    try {
      const relativePath = path.relative(inputDir, imagePath);
      const outputPath = path.join(outputDir, relativePath.replace(/\.[^/.]+$/, '.webp'));
      
      // Create output directory structure
      const outputDirPath = path.dirname(outputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }
      
      // Convert to WebP with optimization
      await sharp(imagePath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      console.log(`✓ Converted: ${relativePath} -> ${path.relative(outputDir, outputPath)}`);
    } catch (error) {
      console.error(`✗ Failed to convert ${imagePath}:`, error.message);
    }
  }
}

// Convert all asset directories
const assetDirs = [
  'src/assets/guro.ai',
  'src/assets/SkillFoundri', 
  'src/assets/rage',
  'src/assets/urbancare',
  'src/assets/fantasticbabyshakala',
  'src/assets/Websites Created and Maintained',
  'src/assets/Companies',
  'src/assets/SocMed',
  'src/assets/printed materials',
  'src/assets/SEO',
  'src/assets/FitSync',
  'src/assets/IX Solutions',
  'src/assets/WhosIn',
  'src/assets/Automation Challenger'
];

console.log('🖼️  Starting WebP conversion...\n');

// Process each directory
for (const dir of assetDirs) {
  if (fs.existsSync(dir)) {
    const outputDir = dir.replace('src/assets', 'src/assets/webp');
    console.log(`📁 Processing: ${dir}`);
    await convertToWebP(dir, outputDir);
    console.log('');
  } else {
    console.log(`⚠️  Directory not found: ${dir}\n`);
  }
}

// Top-level images in src/assets (covers, headshot)
for (const file of fs.readdirSync('src/assets')) {
  const full = path.join('src/assets', file);
  if (!fs.statSync(full).isFile() || !/.(png|jpe?g)$/i.test(file)) continue;
  const out = path.join('src/assets/webp', file.replace(/.[^/.]+$/, '.webp'));
  await sharp(full).webp({ quality: 85, effort: 6 }).toFile(out);
  console.log(`✓ Converted: ${file}`);
}

console.log('🎉 WebP conversion completed!');
