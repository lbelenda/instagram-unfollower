import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export function generateUsernamesList() {
  const __filename = fileURLToPath(import.meta.url);
  const filePath = path.join(path.dirname(__filename), 'pending_follow_requests.json');

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}\nPlease ensure 'pending_follow_requests.json' is in the project directory.`);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Validate JSON structure
    if (!jsonData.relationships_follow_requests_sent) {
      throw new Error('Invalid file structure: missing "relationships_follow_requests_sent" key in JSON file.');
    }
    
    const values = jsonData.relationships_follow_requests_sent.map(request => {
      return request.string_list_data[0]["value"];
    }).flat();

    return values;
  } catch (err) {
    if (err.message.includes('relationships_follow_requests_sent')) {
      throw err; // Re-throw our custom validation error
    }
    throw new Error(`Error reading or parsing file: ${err.message}`);
  }
}
