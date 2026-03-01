const fs = require('fs');
const path = require('path');

// Extract base name from filename
function getBaseName(filename) {
  // Remove .json extension
  let base = filename.replace('.json', '');

  // Remove tt_ prefix if present
  const isTt = base.startsWith('tt_');
  if (isTt) {
    base = base.substring(3);
  }

  // Remove D or U suffix
  if (base.endsWith('D') || base.endsWith('U')) {
    base = base.slice(0, -1);
  }

  return { base, isTt };
}

// Scan and identify all D/U file pairs
function identifyFilePairs(directory) {
  const files = fs.readdirSync(directory).filter(f => f.endsWith('.json'));
  const pairs = new Map();

  files.forEach(filename => {
    // Skip special files
    if (filename === 'test.json' || filename === 'tt_all.json') {
      return;
    }

    const { base, isTt } = getBaseName(filename);

    if (!pairs.has(base)) {
      pairs.set(base, { base, d: null, u: null, tt_d: null, tt_u: null });
    }

    const pair = pairs.get(base);

    if (isTt) {
      if (filename.includes(`${base}D.json`)) {
        pair.tt_d = filename;
      } else if (filename.includes(`${base}U.json`)) {
        pair.tt_u = filename;
      }
    } else {
      if (filename.endsWith('D.json')) {
        pair.d = filename;
      } else if (filename.endsWith('U.json')) {
        pair.u = filename;
      }
    }
  });

  return Array.from(pairs.values());
}

// Merge regular route files (combine D and U trip data)
function mergeRegularFiles(dFile, uFile, outputFile, baseName) {
  console.log(`  Merging ${path.basename(dFile)} + ${path.basename(uFile)} → ${path.basename(outputFile)}`);

  // Read both files
  const dData = JSON.parse(fs.readFileSync(dFile, 'utf8'));
  const uData = JSON.parse(fs.readFileSync(uFile, 'utf8'));

  // Combine arrays
  const merged = [...dData, ...uData];

  // Update ROUTE_CODE field and renumber ROWID
  merged.forEach((trip, index) => {
    trip.ROWID = index + 1;
    trip.ROUTE_CODE = baseName;
  });

  // Write merged file
  fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
  console.log(`    ✓ ${merged.length} trips (${dData.length} + ${uData.length})`);
}

// Copy tt_ file (use only U file per user preference)
function copyTtFile(uFile, outputFile) {
  console.log(`  Copying ${path.basename(uFile)} → ${path.basename(outputFile)}`);

  // Read U file
  const data = JSON.parse(fs.readFileSync(uFile, 'utf8'));

  // Write to new filename
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`    ✓ ${data.Table ? data.Table.length : 0} stops`);
}

// Update filenames.txt
function updateFilenamesList(directory, pairs) {
  const newFilenames = pairs
    .map(pair => `${pair.base}.json`)
    .sort((a, b) => {
      // Natural sort for route numbers
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
      if (aNum !== bNum) return aNum - bNum;
      return a.localeCompare(b);
    });

  const outputPath = path.join(directory, 'filenames.txt');
  fs.writeFileSync(outputPath, newFilenames.join('\n'));
  console.log(`\n✓ Updated filenames.txt with ${newFilenames.length} routes`);
}

// Verify merged files
function verifyMergedFiles(directory, pairs) {
  console.log('\n=== Verification ===\n');
  let errors = 0;

  pairs.forEach(pair => {
    const mergedFile = path.join(directory, `${pair.base}.json`);
    const ttMergedFile = path.join(directory, `tt_${pair.base}.json`);

    // Check regular file
    if (pair.d && pair.u) {
      if (fs.existsSync(mergedFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(mergedFile, 'utf8'));
          console.log(`✓ ${pair.base}.json - ${data.length} trips`);
        } catch (e) {
          console.error(`✗ ${pair.base}.json - Invalid JSON: ${e.message}`);
          errors++;
        }
      } else {
        console.error(`✗ ${pair.base}.json - File not found`);
        errors++;
      }
    }

    // Check tt_ file
    if (pair.tt_u) {
      if (fs.existsSync(ttMergedFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(ttMergedFile, 'utf8'));
          console.log(`✓ tt_${pair.base}.json - ${data.Table ? data.Table.length : 0} stops`);
        } catch (e) {
          console.error(`✗ tt_${pair.base}.json - Invalid JSON: ${e.message}`);
          errors++;
        }
      } else {
        console.error(`✗ tt_${pair.base}.json - File not found`);
        errors++;
      }
    }
  });

  return errors;
}

// Main processing function
function processAllRoutes() {
  console.log('=== Route File Merger ===\n');

  const routeDetailsDir = path.join(__dirname, '../route_details');
  const backupDir = path.join(routeDetailsDir, '_backup_du_files');

  console.log(`Source directory: ${routeDetailsDir}`);
  console.log(`Backup directory: ${backupDir}\n`);

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✓ Created backup directory\n');
  }

  // Identify all pairs
  console.log('=== Identifying Route Pairs ===\n');
  const pairs = identifyFilePairs(routeDetailsDir);
  console.log(`Found ${pairs.length} unique routes\n`);

  // Process each pair
  console.log('=== Processing Routes ===\n');
  let processedRegular = 0;
  let processedTt = 0;

  pairs.forEach((pair, index) => {
    console.log(`[${index + 1}/${pairs.length}] Route: ${pair.base}`);

    // Merge regular files
    if (pair.d && pair.u) {
      mergeRegularFiles(
        path.join(routeDetailsDir, pair.d),
        path.join(routeDetailsDir, pair.u),
        path.join(routeDetailsDir, `${pair.base}.json`),
        pair.base
      );

      // Move originals to backup
      fs.renameSync(
        path.join(routeDetailsDir, pair.d),
        path.join(backupDir, pair.d)
      );
      fs.renameSync(
        path.join(routeDetailsDir, pair.u),
        path.join(backupDir, pair.u)
      );

      processedRegular++;
    }

    // Copy tt_ file (use U only)
    if (pair.tt_u) {
      copyTtFile(
        path.join(routeDetailsDir, pair.tt_u),
        path.join(routeDetailsDir, `tt_${pair.base}.json`)
      );

      // Move originals to backup
      if (pair.tt_d) {
        fs.renameSync(
          path.join(routeDetailsDir, pair.tt_d),
          path.join(backupDir, pair.tt_d)
        );
      }
      fs.renameSync(
        path.join(routeDetailsDir, pair.tt_u),
        path.join(backupDir, pair.tt_u)
      );

      processedTt++;
    }

    console.log('');
  });

  // Update filenames.txt
  updateFilenamesList(routeDetailsDir, pairs);

  // Verify merged files
  const errors = verifyMergedFiles(routeDetailsDir, pairs);

  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`✓ Processed ${processedRegular} regular route pairs`);
  console.log(`✓ Processed ${processedTt} tt_ route files`);
  console.log(`✓ Original files backed up to: ${backupDir}`);
  if (errors > 0) {
    console.log(`\n⚠ ${errors} verification errors found`);
  } else {
    console.log(`\n✓ All files verified successfully`);
  }
}

// Run the script
if (require.main === module) {
  try {
    processAllRoutes();
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { processAllRoutes, identifyFilePairs, getBaseName };
