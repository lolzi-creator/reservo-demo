// Natural language parsing for reservation requests
// Parses user input into structured booking data

export interface ParsedReservation {
  name?: string;
  email?: string;
  date?: string;
  time?: string;
  people?: number;
  missing: ('name' | 'email' | 'date' | 'time' | 'people')[];
}

// Parse natural language input into reservation data
export function parseReservation(input: string, now = new Date()): ParsedReservation {
  const result: ParsedReservation = {
    missing: []
  };
  
  const text = input.toLowerCase().trim();
  
  // Parse people count - look for "for X" or any standalone number
  const peopleMatch = text.match(/for\s+(\d+)|(?:^|\s)(\d+)(?:\s|$)/);
  if (peopleMatch) {
    result.people = parseInt(peopleMatch[1] || peopleMatch[2] || '1');
  } else {
    result.missing.push('people');
  }
  
  // Parse time - HH:MM, H:MM, HH, or 12h format with am/pm
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)?/i,  // HH:MM or H:MM with optional am/pm
    /(\d{1,2})\s*(am|pm)/i,           // H am/pm or HH am/pm
    /(\d{1,2})(?:\s|$)/               // HH or H (assume :00)
  ];
  
  let timeMatch = null;
  for (const pattern of timePatterns) {
    timeMatch = text.match(pattern);
    if (timeMatch) break;
  }
  
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3]?.toLowerCase();
    
    // Handle 12-hour format
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    // Format as HH:MM
    result.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    result.missing.push('time');
  }
  
  // Parse date - keywords or explicit dates
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  if (text.includes('today')) {
    result.date = today;
  } else if (text.includes('tomorrow')) {
    result.date = tomorrow;
  } else {
    // Look for YYYY-MM-DD format
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      result.date = dateMatch[1];
    } else {
      result.date = today; // Default to today
    }
  }
  
  // Parse name - after keywords like "under", "for", "name is", "my name is"
  const namePatterns = [
    /under\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){0,2})/i,
    /for\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){0,2})/i,
    /(?:my\s+)?name\s+is\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){0,2})/i
  ];
  
  let nameMatch = null;
  for (const pattern of namePatterns) {
    nameMatch = text.match(pattern);
    if (nameMatch) break;
  }
  
  if (nameMatch) {
    // Capitalize each word
    result.name = nameMatch[1]
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } else {
    result.missing.push('name');
  }
  
  // Parse email - simple regex
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    result.email = emailMatch[1];
  } else {
    result.missing.push('email');
  }
  
  return result;
}
