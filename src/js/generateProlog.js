import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input: The CSV file in 'src/data'
const csvFilePath = path.join(__dirname, '../data/CAR_DETAILS_FROM_CAR_DEKHO.csv');
// Output: The Prolog file in 'src/prolog'
const outputFilePath = path.join(__dirname, '../prolog/car_knowledge_base.pl');

const writeStream = fs.createWriteStream(outputFilePath);

console.log("Starting to write Prolog file...");

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
        try {
            const name = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_'); 
            
            const year = parseInt(data.year);
            const price = parseInt(data.selling_price);
            const fuel = data.fuel ? data.fuel.toLowerCase().replace(/\s/g, '') : '';
            const transmission = data.transmission ? data.transmission.toLowerCase().replace(/\s/g, '') : '';

            // Write to file
            if (name && year && price) {
                const fact = `car(${name}, ${year}, ${price}, '${fuel}', '${transmission}').\n`;
                writeStream.write(fact);
            }
        } catch (err) {
            // Skip bad rows
        }
    })
    .on('end', () => {
        writeStream.write(" % --End of Data--\n");
        console.log(`Data written to: ${outputFilePath}`);
        writeStream.end();
    })
    .on('error', (err) => {
        console.error("Error:", err.message);
    });