// Fixed Test script for Google Sheets connection
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔍 Testing Google Sheets connection...');
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    
    console.log('📋 Spreadsheet ID:', spreadsheetId);
    console.log('📧 Client Email:', clientEmail);
    
    // Validate environment variables
    if (!spreadsheetId || !clientEmail || !privateKey) {
      throw new Error('Missing required environment variables');
    }
    
    // Create JWT auth instance (CORRECTED METHOD)
    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    
    console.log('🔐 JWT Authentication created...');
    
    // Create document with auth (CORRECTED METHOD)
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    
    console.log('✅ Authentication configured!');
    
    // Load document info
    await doc.loadInfo();
    console.log('📊 Document Title:', doc.title);
    console.log('📑 Sheet Count:', doc.sheetCount);
    
    // List all sheets
    console.log('📚 Available Sheets:');
    Object.values(doc.sheetsByIndex).forEach(sheet => {
      console.log(`  - ${sheet.title} (${sheet.rowCount} rows, ${sheet.columnCount} columns)`);
    });
    
    // Test reading from first sheet if it exists
    if (doc.sheetCount > 0) {
      const firstSheet = doc.sheetsByIndex[0];
      console.log(`\n🔍 Testing data read from '${firstSheet.title}'...`);
      
      // Load header row
      await firstSheet.loadHeaderRow();
      console.log('📝 Headers:', firstSheet.headerValues);
      
      // Try to get some rows
      const rows = await firstSheet.getRows({ limit: 3 });
      console.log(`📋 Sample data (${rows.length} rows):`);
      
      rows.forEach((row, index) => {
        console.log(`  Row ${index + 1}:`, 
          firstSheet.headerValues.reduce((obj, header) => {
            obj[header] = row.get(header);
            return obj;
          }, {})
        );
      });
    }
    
    console.log('\n🎉 Connection test successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    // Provide specific debugging info
    if (error.message.includes('No key or keyFile set')) {
      console.error('💡 Check your GOOGLE_SHEETS_PRIVATE_KEY in .env.local');
    } else if (error.message.includes('invalid_grant')) {
      console.error('💡 Check that your service account email is correct and has access to the spreadsheet');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.error('💡 Make sure the spreadsheet is shared with your service account email');
    }
    
    console.error('Full error:', error);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
