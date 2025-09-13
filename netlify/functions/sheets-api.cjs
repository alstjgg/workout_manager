const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// CORS headers for all responses
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Create JWT auth instance (CORRECTED METHOD)
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    
    // Initialize Google Sheets document with auth (CORRECTED METHOD)
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);

    // Load document info and sheets
    await doc.loadInfo();

    const { httpMethod, body } = event;
    const requestData = body ? JSON.parse(body) : {};

    switch (httpMethod) {
      case 'GET':
        return await handleGet(doc, event.queryStringParameters);
      
      case 'POST':
        return await handlePost(doc, requestData);
      
      case 'PUT':
        return await handlePut(doc, requestData);
      
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

  } catch (error) {
    console.error('Sheets API Error:', error);
    
    // Provide more specific error information
    let errorMessage = 'Internal server error';
    if (error.message.includes('No key or keyFile set')) {
      errorMessage = 'Google Sheets authentication failed - check private key';
    } else if (error.message.includes('invalid_grant')) {
      errorMessage = 'Google Sheets authentication failed - check service account email';
    } else if (error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'Permission denied - check spreadsheet sharing settings';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      })
    };
  }
};

// Handle GET requests - fetch data
async function handleGet(doc, queryParams) {
  const { sheet: sheetName, userId, action } = queryParams || {};

  if (!sheetName) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Sheet name required' })
    };
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Sheet '${sheetName}' not found` })
    };
  }

  // Load headers first
  await sheet.loadHeaderRow();
  
  // Get all rows
  const rows = await sheet.getRows();
  
  // Convert to plain objects
  let data = rows.map(row => {
    const obj = {};
    sheet.headerValues.forEach(header => {
      obj[header] = row.get(header);
    });
    return obj;
  });
  
  // Filter by userId if provided
  if (userId) {
    data = data.filter(row => row.user_id === userId || row.id === userId);
  }

  // Handle specific actions
  switch (action) {
    case 'weekly_status':
      // Get current week's status for user
      const currentWeek = getCurrentWeekStart();
      data = data.filter(row => row.week_start_date === currentWeek);
      break;
    
    case 'body_measurements':
      // Get latest measurements
      data = data.sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));
      break;
    
    case 'progress_data':
      // Get last 4 measurements for charts
      data = data
        .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date))
        .slice(0, 4)
        .reverse(); // Reverse to show oldest to newest for charts
      break;
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ data, count: data.length })
  };
}

// Handle POST requests - create data
async function handlePost(doc, requestData) {
  const { sheet: sheetName, data } = requestData;

  if (!sheetName || !data) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Sheet name and data required' })
    };
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Sheet '${sheetName}' not found` })
    };
  }

  // Add timestamp if not provided
  if (!data.created_at) {
    data.created_at = new Date().toISOString();
  }
  
  if (!data.updated_at) {
    data.updated_at = new Date().toISOString();
  }

  // Add the row
  const newRow = await sheet.addRow(data);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ 
      success: true, 
      data: newRow.toObject(),
      message: `Row added to ${sheetName}` 
    })
  };
}

// Handle PUT requests - update data  
async function handlePut(doc, requestData) {
  const { sheet: sheetName, rowId, data, filters } = requestData;

  if (!sheetName || (!rowId && !filters) || !data) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Sheet name, identifier, and data required' })
    };
  }

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Sheet '${sheetName}' not found` })
    };
  }

  const rows = await sheet.getRows();
  let targetRow = null;

  // Find row by ID or filters
  if (rowId) {
    targetRow = rows.find(row => row.get('id') === rowId || row.get('_rowNumber') === parseInt(rowId));
  } else if (filters) {
    targetRow = rows.find(row => {
      return Object.entries(filters).every(([key, value]) => row.get(key) === value);
    });
  }

  if (!targetRow) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Row not found' })
    };
  }

  // Update the row
  Object.entries(data).forEach(([key, value]) => {
    targetRow.set(key, value);
  });
  
  // Add updated timestamp
  targetRow.set('updated_at', new Date().toISOString());
  
  await targetRow.save();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      success: true, 
      data: targetRow.toObject(),
      message: 'Row updated successfully' 
    })
  };
}

// Utility function to get current week start date
function getCurrentWeekStart() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}
