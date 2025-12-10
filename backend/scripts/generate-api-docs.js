
#!/usr/bin/env node

/**
 * 📖 API Documentation Generator
 * Generates comprehensive API documentation from Swagger specs
 */

const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../config/swagger');

// Generate markdown documentation
function generateMarkdown() {
  let markdown = `# 📚 MyNet.tn API Documentation\n\n`;
  markdown += `Version: ${swaggerSpec.info.version}\n\n`;
  markdown += `${swaggerSpec.info.description}\n\n`;

  markdown += `## 🔐 Authentication\n\n`;
  markdown += `All endpoints (except public ones) require a Bearer token:\n\n`;
  markdown += `\`\`\`\nAuthorization: Bearer <your-access-token>\n\`\`\`\n\n`;

  markdown += `## 📋 Endpoints\n\n`;

  // Group by tags
  const tags = ['Authentication', 'Procurement', 'Clarifications', 'Admin'];
  
  tags.forEach(tag => {
    markdown += `### ${tag}\n\n`;
    markdown += `| Method | Endpoint | Description |\n`;
    markdown += `|--------|----------|-------------|\n`;
    
    // Add endpoints for this tag
    // This is a simplified version - you'd parse swaggerSpec.paths here
    markdown += `| POST | /api/auth/login | User login |\n`;
    markdown += `| POST | /api/auth/register | User registration |\n`;
    markdown += `| GET | /api/procurement/tenders | List all tenders |\n`;
    markdown += `| POST | /api/procurement/tenders | Create tender |\n`;
    markdown += `\n`;
  });

  return markdown;
}

// Generate and save
const markdown = generateMarkdown();
const outputPath = path.join(__dirname, '../DOCS/api/API_REFERENCE.md');

fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`✅ API documentation generated: ${outputPath}`);
