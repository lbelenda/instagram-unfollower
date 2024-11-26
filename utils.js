import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export function generateUsernamesList() {
  const __filename = fileURLToPath(import.meta.url);
  const filePath = path.join(path.dirname(__filename), 'pending_follow_requests.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    const values = jsonData.relationships_follow_requests_sent.map(request => {
      return request.string_list_data[0]["value"];
    }).flat();

    console.log("values are", values);
    return values;
  } catch (err) {
    console.error('Error reading or parsing file:', err);
    return [];
  }
}