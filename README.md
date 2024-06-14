---
# Contact List API

## Overview

The Contact List API is a Node.js application that provides a simple API for managing contacts. It uses MongoDB for data storage and supports both JSON and HTML responses. This Docker image packages the Contact List API and makes it easy to deploy the application in any environment that supports Docker.

## Features

- **RESTful API**: Provides endpoints to create, read, update, and delete contacts.
- **MongoDB Integration**: Uses MongoDB as the database to store contact information.
- **HTML and JSON Responses**: Supports both HTML and JSON responses based on the request headers.
- **Dockerized**: Easily deployable using Docker.

## Requirements

- Docker installed on your system
- (Optional) Docker Compose for managing multi-container applications

## Getting Started

### Clone the Repository

```sh
git clone https://github.com/your-username/contact-list-api.git
cd contact-list-api
```

### Running with Docker

1. **Build Docker Image**

   ```sh
   docker build -t contact-list-api .
   ```

2. **Run Docker Container**

   ```sh
   docker run -p 3000:3000 contact-list-api
   ```

   The API will be accessible at `http://localhost:3000`.

### Using Postman for API Testing

1. **Open Postman**: Launch Postman.

2. **Import Collection**: Import the provided Postman collection (`Contact_List_API.postman_collection.json`).

3. **Set Environment Variables** (Optional):
   - Set `baseUrl` to `http://localhost:3000` if not using Postman environment auto-detection.

4. **Perform CRUD Operations**

   - **Create a Contact**
     - **Endpoint:** `POST {{baseUrl}}/contacts`
     - **Request Body (Form data):**
       ```
       {
         "name": "John Doe",
         "phoneNumbers": ["1234567890", "9876543210"],
         "email": "johndoe@example.com",
         "imageUrl": "https://example.com/avatar.jpg",
         "imageFile": "base64_encoded_image_data"
       }
       ```

   - **Update a Contact**
     - **Endpoint:** `PUT {{baseUrl}}/contacts/:id`
     - **Request Body (Form data):**
       ```
       {
         "name": "Updated Name",
         "phoneNumbers": ["9999999999"],
         "email": "updatedemail@example.com",
         "imageUrl": "https://example.com/updated_avatar.jpg",
         "imageFile": "base64_encoded_updated_image_data"
       }
       ```

   - **Fetch All Contacts**
     - **Endpoint:** `GET {{baseUrl}}/contacts`

   - **Delete a Contact**
     - **Endpoint:** `DELETE {{baseUrl}}/contacts/:id`

   - **Search Contacts by Name or Phone Number**
     - **Endpoint:** `GET {{baseUrl}}/contacts/search?q=query`
     - Replace `query` with the name or phone number to search for.

   - **Export Contacts as CSV File**
     - **Endpoint:** `GET {{baseUrl}}/contacts/export`
     - Csv file will be saved inside the local machine.

5. **Verify Responses**: Check the response in Postman's "Response" section to ensure the operation was successful.



---
