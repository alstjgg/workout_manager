// Test script to verify Google Sheets connection (Updated authentication)
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔍 Testing Google Sheets connection...');
    
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    
    console.log('📋 Spreadsheet ID:', process.env.SPREADSHEET_ID);
    console.log('📧 Client Email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
    
    // Create JWT auth instance
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    
    // Authenticate
    doc.useServiceAccountAuth(serviceAccountAuth);
    
    console.log('✅ Authentication configured!');
    
    // Load document info
    await doc.loadInfo();
    console.log('📊 Document Title:', doc.title);
    console.log('📑 Sheet Count:', doc.sheetCount);
    
    // List all sheets
    console.log('📚 Available Sheets:');
    Object.values(doc.sheetsByIndex).forEach(sheet => {
      console.log(`  - ${sheet.title} (${sheet.rowCount} rows)`);
    });
    
    // Test reading users data
    const usersSheet = doc.sheetsByTitle['users'];
    const userRows = await usersSheet.getRows();
    console.log('👥 User Data:');
    userRows.forEach(row => {
      console.log(`  - ${row.get('name')}: ${row.get('goal')} (${row.get('age')}yo)`);
    });
    
    console.log('🎉 Connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
