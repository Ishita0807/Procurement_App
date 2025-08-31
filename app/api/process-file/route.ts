import { NextRequest, NextResponse } from 'next/server';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { Supplier } from '@/types';
// import xlsx from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const { file_url } = await request.json();
    
    if (!file_url) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 });
    }

    // Convert URL to file path
    const filename = file_url.replace('/uploads/', '');
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    let extractedData:Supplier[] = [];
    const fileExtension = path.extname(filename).toLowerCase();

    if (fileExtension === '.csv') {
      // Process CSV file
      extractedData = await processCsvFile(filepath) as Supplier[];
      
    // } else if (['.xlsx', '.xls'].includes(fileExtension)) {
    //   // Process Excel file
    //   extractedData = processExcelFile(filepath);
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      output: extractedData,
      total_records: extractedData.length
    });

  } catch (error:any) {
    console.error('Processing error:', error);
    return NextResponse.json({
      status: 'error',
      details: error?.message
    }, { status: 500 });
  }
}

// Helper function to process CSV files
function processCsvFile(filepath: string) {
  return new Promise((resolve, reject) => {
    const results:Supplier[] = [];
    
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (data) => {
        // Convert string values to appropriate types
        const processed = processRowData(data);
        results.push(processed);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Helper function to process Excel files
// function processExcelFile(filepath:string) {
//   const workbook = xlsx.readFile(filepath);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   const jsonData = xlsx.utils.sheet_to_json(worksheet);
  
//   return jsonData.map(row => processRowData(row));
// }

// Helper function to process individual rows
function processRowData(row:any) {
  const processed:any = {};
  
  Object.keys(row).forEach(key => {
    const value = row[key];
    const cleanKey = key.toLowerCase().replace(/\s+/g, '_');
    
    // Convert data types
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
        processed[cleanKey] = true;
      } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
        processed[cleanKey] = false;
      } else if (!isNaN(parseInt(value)) && value !== '') {
        processed[cleanKey] = parseFloat(value);
      } else {
        processed[cleanKey] = value;
      }
    } else {
      processed[cleanKey] = value;
    }
  });
  
  return processed;
}