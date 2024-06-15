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
