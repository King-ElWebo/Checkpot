const fs = require('fs');

function analyze(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const report = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`=== Results for ${filePath} ===`);
  console.log('Performance Score:', Math.round(report.categories.performance.score * 100));
  console.log('First Contentful Paint:', report.audits['first-contentful-paint']?.displayValue);
  console.log('Largest Contentful Paint:', report.audits['largest-contentful-paint']?.displayValue);
  console.log('Total Blocking Time:', report.audits['total-blocking-time']?.displayValue);
  console.log('Speed Index:', report.audits['speed-index']?.displayValue);
  console.log('Cumulative Layout Shift:', report.audits['cumulative-layout-shift']?.displayValue);
  console.log('Total Network Payload:', report.audits['total-byte-weight']?.displayValue);
  console.log('Image Optimization Potential:', report.audits['modern-image-formats']?.displayValue || 'None');
  console.log('Cache Lifetime Potential:', report.audits['uses-long-cache-ttl']?.displayValue || 'None');
  console.log('Unused JS:', report.audits['unused-javascript']?.displayValue || 'None');
  console.log('Render-blocking resources:', report.audits['render-blocking-resources']?.displayValue || 'None');
  console.log('');
}

analyze('baseline-report.json');
analyze('preview-mobile.json');
analyze('baseline-desktop.json');
analyze('preview-desktop.json');
