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

### Using Postman for API Testing

1. **Open Postman**: Launch Postman.

2. **Perform CRUD Operations**

   - **Create a Contact**
   - **Use locathost:3000 to perform the API in Local Machine**
     - **Endpoint:** `POST localhost:3000/contacts`
     - **Request Body (Form data - Key Value Pair):**
       ```
       {
         "name": "John Doe",
         "phoneNumbers": ["1234567890", "9876543210"],
         "imageUrl": "https://example.com/avatar.jpg",
       }
       ```

   - **Update a Contact**
     - **Endpoint:** `PUT localhost:3000/contacts/:id`
     - **Request Body (Form data - Key Value Pair):**
       ```
       {
         "name": "Updated Name",
         "phoneNumbers": ["9999999999"],
         "imageUrl": "https://example.com/updated_avatar.jpg",
       }
       ```

   - **Fetch All Contacts**
     - **Endpoint:** `GET localhost:3000/contacts`

   - **Delete a Contact**
     - **Endpoint:** `DELETE localhost:3000/contacts/:id`

   - **Search Contacts by Name or Phone Number**
     - **Endpoint:** `GET localhost:3000/contacts/search?q=query`
     - Replace `query` with the name or phone number to search for.

   - **Export Contacts as CSV File**
     - **Endpoint:** `GET localhost:3000/contacts/export`
     - Csv file will be saved inside the local machine.

3. **Verify Responses**: Check the response in Postman's "Response" section to ensure the operation was successful.



---
