// const { createObjectCsvWriter } = require('csv-writer');

// const Contact = require('../models/contact'); // Adjust path as per your project structure

// async function generateContactsCSV(contacts) {
//   try {
//     const csvWriter = createObjectCsvWriter({
//       path: 'contacts.csv',
//       header: [
//         { id: 'name', title: 'Name' },
//         { id: 'phoneNumbers', title: 'Phone Numbers' },
//         { id: 'imageUrl', title: 'Image URL' },
//         { id: 'imageFile', title: 'Image File' },
//       ],
//     });

//     const records = contacts.map(contact => ({
//       name: contact.name,
//       phoneNumbers: contact.phoneNumbers.join(', '), // Join phone numbers if they are stored as an array
//       imageUrl: contact.imageUrl || 'NA', // Display 'NA' if imageUrl is not present
//       imageFile: contact.imageFile ? 'Image present' : 'NA', // Display 'NA' if imageFile is not present
//     }));

//     await csvWriter.writeRecords(records);

//     return 'CSV file generated successfully';
//   } catch (error) {
//     console.error('Error generating CSV:', error);
//     throw error;
//   }
// }

// module.exports = generateContactsCSV;

const { createObjectCsvWriter } = require('csv-writer');

async function generateContactsCSV(contacts) {
  try {
    const csvWriter = createObjectCsvWriter({
      path: 'contacts.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'phoneNumbers', title: 'Phone Numbers' },
        { id: 'imageUrl', title: 'Image URL' },
        { id: 'imageFile', title: 'Image File' },
      ],
    });

    const records = contacts.map(contact => ({
      name: contact.name,
      phoneNumbers: contact.phoneNumbers.map(num => num.phoneNumber).join(', '), // Extract phoneNumber and join
      imageUrl: contact.imageUrl || 'NA',
      imageFile: contact.imageFile ? 'Image present' : 'NA',
    }));

    await csvWriter.writeRecords(records);

    // Read the saved file and return its contents
    const fs = require('fs');
    const csvFilePath = 'contacts.csv';
    const csvContents = fs.readFileSync(csvFilePath, 'utf-8');

    return csvContents;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
}

module.exports = generateContactsCSV;
