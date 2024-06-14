const express = require('express');
const multer = require('multer');
const Contact = require('../models/contact');
const generateContactsCSV = require('../services/csvService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit file size to 5MB
  }
});

// Create New Contact
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, phoneNumbers, imageUrl } = req.body;
    let imageFile = null;

    if (req.file) {
      imageFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    // Ensure phoneNumbers is parsed correctly
    const parsedPhoneNumbers = JSON.parse(phoneNumbers);
    if (!Array.isArray(parsedPhoneNumbers)) {
      throw new Error('phoneNumbers should be a JSON array');
    }

    // Check for duplicate name
    const existingContactWithName = await Contact.findOne({ name });
    if (existingContactWithName) {
      throw new Error('A contact with this name already exists');
    }

    // Check for duplicate phone number
    const existingContactWithPhoneNumber = await Contact.findOne({
      'phoneNumbers.phoneNumber': { $in: parsedPhoneNumbers }
    });
    if (existingContactWithPhoneNumber) {
      throw new Error('A contact with one of these phone numbers already exists');
    }

    const contact = new Contact({
      name,
      phoneNumbers: parsedPhoneNumbers.map(phoneNumber => ({ phoneNumber })),
      imageFile,
      imageUrl // Store the imageUrl if provided
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Contact
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, phoneNumbers, imageUrl } = req.body;
    let imageFile = null;

    if (req.file) {
      imageFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    // Ensure phoneNumbers is parsed correctly
    const parsedPhoneNumbers = phoneNumbers ? JSON.parse(phoneNumbers) : undefined;
    if (parsedPhoneNumbers && !Array.isArray(parsedPhoneNumbers)) {
      throw new Error('phoneNumbers should be a JSON array');
    }

    // Check for duplicate name
    if (name) {
      const existingContactWithName = await Contact.findOne({ name, _id: { $ne: req.params.id } });
      if (existingContactWithName) {
        throw new Error('A contact with this name already exists');
      }
    }

    // Check for duplicate phone number
    if (parsedPhoneNumbers) {
      const existingContactWithPhoneNumber = await Contact.findOne({
        'phoneNumbers.phoneNumber': { $in: parsedPhoneNumbers },
        _id: { $ne: req.params.id }
      });
      if (existingContactWithPhoneNumber) {
        throw new Error('A contact with one of these phone numbers already exists');
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(parsedPhoneNumbers && { phoneNumbers: parsedPhoneNumbers.map(phoneNumber => ({ phoneNumber })) }),
      ...(imageFile && { imageFile }),
      ...(imageUrl && { imageUrl }) // Ensure to update imageUrl if provided
    };

    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Search Contacts
router.get('/search', async (req, res) => {
  try {
    const { name, phoneNumber } = req.query;
    const query = {};

    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (phoneNumber) {
      query['phoneNumbers'] = { $elemMatch: { $regex: phoneNumber, $options: 'i' } };
    }

    const contacts = await Contact.find(query);

    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/export', async (req, res) => {
  try {
    const contacts = await Contact.find();
    const csv = await generateContactsCSV(contacts); // Ensure to await here since generateContactsCSV is asynchronous

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch All Contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({}, 'name phoneNumbers imageUrl imageFile');

    if (req.accepts('html')) {
      const html = generateContactsHTML(contacts);
      res.send(html);
    } else {
      res.json(contacts);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Function to generate HTML table
function generateContactsHTML(contacts) {
  const tableRows = contacts.map(contact => `
    <tr>
      <td>${contact._id}</td>
      <td>${contact.name}</td>
      <td>${contact.phoneNumbers.map(p => p.phoneNumber).join(', ')}</td>
      <td>${contact.imageUrl ? contact.imageUrl : 'NA'}</td>
      <td>${contact.imageFile && contact.imageFile.data ? 'Image Present' : 'NA'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Contacts Table</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
    
    <h2>Contacts Table</h2>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone Numbers</th>
          <th>Image URL</th>
          <th>Image File</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    </body>
    </html>
  `;

  return html;
}


module.exports = router;
