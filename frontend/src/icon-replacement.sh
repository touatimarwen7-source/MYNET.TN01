#!/bin/bash

# Replace emojis with professional corporate icons or remove them
# Professional Financial Style Icon Mapping

# Pages
for file in pages/*.jsx; do
  # Remove emojis from section titles - keep text only
  sed -i "s/📋 //" "$file"
  sed -i "s/📄 //" "$file"
  sed -i "s/📊 //" "$file"
  sed -i "s/🏆 //" "$file"
  sed -i "s/🎯 //" "$file"
  sed -i "s/📧 //" "$file"
  sed -i "s/👤 //" "$file"
  sed -i "s/🏢 //" "$file"
  sed -i "s/📱 //" "$file"
  sed -i "s/⚙️ //" "$file"
  sed -i "s/📈 //" "$file"
  sed -i "s/🌐 //" "$file"
  sed -i "s/📍 //" "$file"
  sed -i "s/⭐ //" "$file"
  sed -i "s/📤 //" "$file"
  sed -i "s/📥 //" "$file"
  sed -i "s/📝 //" "$file"
  sed -i "s/🔔 //" "$file"
  
  # Replace checkmarks and X marks with text equivalents in labels
  sed -i "s/✔ //" "$file"
  sed -i "s/✓ //" "$file"
  sed -i "s/❌ //" "$file"
  sed -i "s/⏳ //" "$file"
  sed -i "s/💾 //" "$file"
  sed -i "s/✕ //" "$file"
  sed -i "s/🗑️ //" "$file"
  sed -i "s/👁️ //" "$file"
  sed -i "s/🔒 //" "$file"
  sed -i "s/🔍 //" "$file"
  sed -i "s/🔎 //" "$file"
  sed -i "s/🏪 //" "$file"
  sed -i "s/➕ //" "$file"
  sed -i "s/🔄 //" "$file"
done

# Components
for file in components/*.jsx; do
  sed -i "s/📋 //" "$file"
  sed -i "s/📄 //" "$file"
  sed -i "s/📊 //" "$file"
  sed -i "s/🏆 //" "$file"
  sed -i "s/🎯 //" "$file"
  sed -i "s/📧 //" "$file"
  sed -i "s/👤 //" "$file"
  sed -i "s/🏢 //" "$file"
  sed -i "s/📱 //" "$file"
  sed -i "s/⚙️ //" "$file"
  sed -i "s/📈 //" "$file"
  sed -i "s/🌐 //" "$file"
  sed -i "s/📍 //" "$file"
  sed -i "s/⭐ //" "$file"
  sed -i "s/📤 //" "$file"
  sed -i "s/📥 //" "$file"
  sed -i "s/📝 //" "$file"
  sed -i "s/🔔 //" "$file"
  sed -i "s/✔ //" "$file"
  sed -i "s/✓ //" "$file"
  sed -i "s/❌ //" "$file"
  sed -i "s/⏳ //" "$file"
  sed -i "s/💾 //" "$file"
  sed -i "s/✕ //" "$file"
  sed -i "s/🗑️ //" "$file"
  sed -i "s/👁️ //" "$file"
  sed -i "s/🔒 //" "$file"
  sed -i "s/🔍 //" "$file"
  sed -i "s/🔎 //" "$file"
  sed -i "s/🏪 //" "$file"
  sed -i "s/➕ //" "$file"
  sed -i "s/🔄 //" "$file"
done

echo "✓ All emojis removed from professional labels"
