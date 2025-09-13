// Test script to check Google Sheets permissions
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testPermissions() {
  try {
    console.log('🔍 Testing Google Sheets permissions...');
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    console.log('📧 Service Account:', clientEmail);
    console.log('📋 Spreadsheet ID:', spreadsheetId);
    
    // Create JWT auth
    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    
    console.log('🔐 Attempting to access spreadsheet...');
    
    try {
      await doc.loadInfo();
      console.log('✅ SUCCESS! Spreadsheet access granted');
      console.log('📊 Document Title:', doc.title);
      console.log('📑 Sheet Count:', doc.sheetCount);
      
      if (doc.sheetCount > 0) {
        console.log('📚 Available Sheets:');
        Object.values(doc.sheetsByIndex).forEach((sheet, index) => {
          console.log(`  ${index + 1}. "${sheet.title}" - ${sheet.rowCount} rows, ${sheet.columnCount} columns`);
        });
        
        // Test reading from first sheet
        const firstSheet = doc.sheetsByIndex[0];
        console.log(`\n🔍 Testing read access on "${firstSheet.title}"...`);
        
        try {
          await firstSheet.loadHeaderRow();
          console.log('✅ Headers loaded:', firstSheet.headerValues || 'No headers found');
          
          const rows = await firstSheet.getRows({ limit: 1 });
          console.log(`✅ Can read data: ${rows.length} sample rows retrieved`);
          
        } catch (readError) {
          console.log('⚠️  Can access sheet info but cannot read data:', readError.message);
        }
      }
      
    } catch (accessError) {
      if (accessError.message.includes('403')) {
        console.log('❌ PERMISSION DENIED');
        console.log('💡 TO FIX THIS:');
        console.log('   1. Open your Google Sheet in browser');
        console.log('   2. Click "Share" button');
        console.log('   3. Add this email as Editor:');
        console.log(`      ${clientEmail}`);
        console.log('   4. Click "Send"');
        console.log('   5. Run this test again');
      } else {
        console.log('❌ ACCESS ERROR:', accessError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPermissions();
