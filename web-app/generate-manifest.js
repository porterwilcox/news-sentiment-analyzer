const fs = require('fs');
const path = require('path');

const iconsPath = path.resolve(__dirname, 'public', 'icons.json');
const iconsData = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));

// Define the base manifest.json structure
const manifest = {
  name: "News Sentiment Analyzer",
  short_name: "News Sentiments",
  description: "Analyze news headlines sentiments using the News API and OpenAI API",
  start_url: ".",
  display: "standalone",
  background_color: "#6c757d",
  theme_color: "#343a40",
  icons: iconsData["icons"],
};

const manifestPath = path.resolve(__dirname, 'public', 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('manifest.json generated successfully');
