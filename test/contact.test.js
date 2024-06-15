const request = require('supertest');
const app = require('../app'); 
const Contact = require('../models/contact');
const fs = require('fs');
const generateContactsCSV = require('../services/csvService.js');

// Test data
const testContact = {
  name: 'John Doe',
  phoneNumbers: [{ phoneNumber: '5555555555' }], 
  imageUrl: 'https://example.com/john-doe.jpg'
};

let testContactId; // To store the ID of the created contact for later tests

beforeEach(async () => {
  // Clean up or initialize test database state before each test
  await Contact.deleteMany({});
});

describe('Contact API Endpoints', () => {
  describe('POST /contacts', () => {
    it('should create a new contact', async () => {
      const res = await request(app)
        .post('/contacts')
        .send({
          name: testContact.name,
          phoneNumbers: JSON.stringify(testContact.phoneNumbers.map(p => p.phoneNumber)),
          imageUrl: testContact.imageUrl
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toEqual(testContact.name);

      testContactId = res.body._id; // Store ID for later use
    });

    it('should return 400 if name already exists', async () => {
      // Create a contact first
      await Contact.create(testContact);

      const res = await request(app)
        .post('/contacts')
        .send({
          name: testContact.name,
          phoneNumbers: JSON.stringify(testContact.phoneNumbers.map(p => p.phoneNumber)),
          imageUrl: testContact.imageUrl
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if phone number already exists', async () => {
      // Create a contact first
      await Contact.create(testContact);

      const res = await request(app)
        .post('/contacts')
        .send({
          name: 'Jane Doe',
          phoneNumbers: JSON.stringify(testContact.phoneNumbers.map(p => p.phoneNumber)),
          imageUrl: 'https://example.com/jane-doe.jpg'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /contacts/:id', () => {
    it('should update an existing contact', async () => {
      // Create a contact first
      const createdContact = await Contact.create(testContact);

      const updatedContactData = {
        name: 'Updated Name',
        phoneNumbers: JSON.stringify(['6666666666']),
        imageUrl: 'https://example.com/updated.jpg'
      };

      const res = await request(app)
        .put(`/contacts/${createdContact._id}`)
        .send({
          name: updatedContactData.name,
          phoneNumbers: updatedContactData.phoneNumbers,
          imageUrl: updatedContactData.imageUrl
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', createdContact._id.toString());
      expect(res.body.name).toEqual(updatedContactData.name);
    });

    it('should return 404 if contact not found', async () => {
      const res = await request(app)
        .put('/contacts/123456789012345678901234') // Invalid ID
        .send({
          name: 'Updated Name'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /contacts/:id', () => {
    it('should delete an existing contact', async () => {
      // Create a contact first
      const createdContact = await Contact.create(testContact);

      const res = await request(app)
        .delete(`/contacts/${createdContact._id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Contact deleted successfully');
    });

    it('should return 404 if contact not found', async () => {
      const res = await request(app)
        .delete('/contacts/123456789012345678901234'); // Invalid ID

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /contacts/export', () => {
    it('should export contacts to CSV', async () => {
      // Create a contact first
      await Contact.create(testContact);
  
      // Generate CSV
      const csvContents = await generateContactsCSV([testContact]);
  
      const res = await request(app)
        .get('/contacts/export')
        .expect('Content-Type', 'text/csv; charset=utf-8')
        .expect('Content-Disposition', 'attachment; filename=contacts.csv');
  
      // Assert the response text matches the generated CSV contents
      expect(res.text).toEqual(csvContents);
    });
  });
  
  it('should fetch all contacts as JSON', async () => {
    // Create a contact first
    await Contact.create(testContact);

    const res = await request(app)
      .get('/contacts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true); // Ensure response body is an array
    expect(res.body.length).toEqual(1); // Assuming only one contact was created
    expect(res.body[0]).toHaveProperty('name', testContact.name);
  });
  
});

afterAll(async () => {
  // Clean up or close any necessary resources after all tests
  await Contact.deleteMany({});
});
