<h1 align="center">Tradelous Backend</h1>

<p align="center">
    Backend service for the <a href="https://github.com/RiadOliveira/Tradelous-desktop">Tradelous Desktop</a> and <a href="https://github.com/RiadOliveira/Tradelous-mobile">Tradelous Mobile</a> applications, providing comprehensive API endpoints and data management for users, companies, products, and sales. Built as a robust foundation to support the frontend applications.
</p>

![Preview](https://github.com/user-attachments/assets/381aa4a1-12e9-41bf-a861-60a8049832a4)
![License](https://img.shields.io/github/license/RiadOliveira/Tradelous-backend)

<br/>

Contents
=================
<!--ts-->
* [🛠️ Technologies](#technologies)
* [🚀 Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation & Setup](#setup)
  * [API Testing](#testing)
* [⚙️ Features](#features)
* [🗃️ Database Entities](#entities)
  * [User](#entity-user)
  * [Company](#entity-company)
  * [Product](#entity-product)
  * [Sale](#entity-sale)
* [🔗 API Endpoints](#routes)
  * [User Routes](#user-routes)
    * [POST /sign-up](#user-sign-up)
    * [POST /sessions](#user-sessions)
    * [POST /forgot-password](#user-forgot-password)
    * [POST /recover-password](#user-recover-password)
    * [PUT /](#user-update)
    * [PATCH /update-avatar](#user-update-avatar)
    * [PATCH /leave-company](#user-leave-company)
    * [DELETE /](#user-delete)
  * [Company Routes](#company-routes)
    * [GET /](#company-show)
    * [POST /](#company-register)
    * [GET /list-employees](#company-list-employees)
    * [PUT /](#company-update)
    * [PATCH /update-logo](#company-update-logo)
    * [PATCH /hire-employee/:employeeId](#company-hire-employee)
    * [PATCH /fire-employee/:employeeId](#company-fire-employee)
    * [DELETE /](#company-delete)
  * [Product Routes](#products-routes)
    * [GET /](#products-list)
    * [POST /](#products-add)
    * [PUT /:productId](#products-update)
    * [PATCH /update-image/:productId](#products-update-image)
    * [DELETE /:productId](#products-delete)
  * [Sales Routes](#sales-routes)
    * [GET /employee/:employeeId](#sales-employee)
    * [GET /day/:day-:month-:year](#sales-day)
    * [GET /week/:day-:month-:year](#sales-week)
    * [GET /month/:day-:month-:year](#sales-month)
    * [POST /](#sales-create)
    * [PUT /:saleId](#sales-update)
    * [DELETE /:saleId](#sales-delete)
* [📝 License](#license)
* [👨‍💻 Author](#author)
* [🌐 Socials](#socials)
<!--te-->
<br/>

<h2 id="technologies">🛠️ Technologies</h2>
Built with:

* [Node.js](https://nodejs.org/en/)
* [PostgreSQL](https://www.postgresql.org/)
* [TypeScript](https://www.typescriptlang.org/) <br/><br/>

<h2 id="getting-started">🚀 Getting Started</h2>

<h3 id="prerequisites">Prerequisites</h3>

Before running the backend service, ensure the following tools are installed on your system:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/en/)
* [PostgreSQL](https://www.postgresql.org/)

<h3 id="setup">Installation & Setup</h3>

```bash
# Clone the repository
$ git clone https://github.com/RiadOliveira/Tradelous-backend.git

# Navigate to project directory
$ cd Tradelous-backend

# Install dependencies
$ npm install

# Environment Configuration
# Copy example files and configure your environment
$ cp .env.example .env
$ cp ormconfig.example.json ormconfig.json

# Configure database connection in ormconfig.json
# Update the following fields with your PostgreSQL credentials:
# "username": "your_username",
# "password": "your_password",
# "database": "your_database_name"

# Run database migrations
$ npm run typeorm migration:run

# Start the development server
$ npm run dev
```

<h3 id="testing">API Testing</h3>

For comprehensive API testing, an [Insomnia](https://insomnia.rest) collection is available with all configured endpoints: [tradelous-insomnia.json](https://github.com/RiadOliveira/Tradelous-backend/blob/main/tradelous-insomnia.json).

<br/>

<h2 id="features">⚙️ Features</h2>

- **Authentication & Authorization** - Complete user authentication system with JWT tokens, password recovery, and role-based access control for administrators and employees.
- **User Management** - Full user lifecycle management including registration, profile updates, avatar handling, and account deletion with proper data cleanup.
- **Company Administration** - Comprehensive company management with registration, employee hiring/firing, and administrative controls for business operations.
- **Product Catalog System** - Complete CRUD operations for product management with image handling, barcode support, and inventory tracking.
- **Sales Transaction Management** - Sales recording system with multiple payment methods, quantity tracking, and comprehensive reporting capabilities.
- **File Upload Handling** - File upload and management for user avatars, company logos, and product images.
- **Data Analytics** - Flexible sales reporting with date-range filtering (daily, weekly, monthly) and employee-specific sales tracking.
- **Email Integration** - Password recovery system with email notifications using Ethereal for development testing. <br/><br/>

<h2 id="entities">🗃️ Database Entities</h2>

<h3 id="entity-user">User</h3>

- **id**: UUID
- **name**: string
- **email**: string
- **password**: string
- **isAdmin**: boolean - Administrator privileges (false if not associated with a company)
- **companyId**: UUID/null
- **avatar**: string/null - Avatar image filename

<h3 id="entity-company">Company</h3>

- **id**: UUID
- **name**: string
- **cnpj**: number
- **address**: string
- **logo**: string/null - Company logo filename
- **adminId**: string

<h3 id="entity-product">Product</h3>

- **id**: UUID
- **name**: string
- **companyId**: UUID
- **price**: number
- **quantity**: number
- **brand**: string
- **barCode**: string/null
- **image**: string/null - Product image filename

<h3 id="entity-sale">Sale</h3>

- **id**: UUID
- **companyId**: UUID
- **employeeId**: UUID
- **productId**: UUID
- **date**: Date - Sale timestamp (auto-generated)
- **method**: string - Payment method ('money' or 'card')
- **totalPrice**: number - Total sale amount (price × quantity)

<br/>

<h2 id="routes">🔗 API Endpoints</h2>

<h3 id="user-routes">User Routes (/user)</h3>

<h4 id="user-sign-up">POST /sign-up</h4>

Creates a new user account
- **Request**: name, email, password, confirmPassword
- **Response**: User object with generated ID and timestamps

<h4 id="user-sessions">POST /sessions</h4>

Generates authentication token for login
- **Request**: email, password
- **Response**: User object and JWT token

<h4 id="user-forgot-password">POST /forgot-password</h4>

Sends recovery email with reset token
- **Request**: email
- **Response**: No content (email sent via Ethereal)

<h4 id="user-recover-password">POST /recover-password</h4>

Updates password using recovery token
- **Request**: confirmEmail, newPassword, confirmPassword, recoverToken
- **Response**: No content

<h4 id="user-update">PUT /</h4>

Updates authenticated user's profile
- **Request**: name, email, oldPassword (optional), newPassword (optional), confirmPassword (optional)
- **Response**: Updated user object

<h4 id="user-update-avatar">PATCH /update-avatar</h4>

Updates or removes user avatar
- **Request**: avatar file (multipart/form-data)
- **Response**: Updated user object

<h4 id="user-leave-company">PATCH /leave-company</h4>

Removes user from associated company
- **Request**: No body required
- **Response**: No content

<h4 id="user-delete">DELETE /</h4>

Deletes user account and associated data
- **Request**: No body required
- **Response**: No content

<h3 id="company-routes">Company Routes (/company)</h3>

<h4 id="company-show">GET /</h4>

Retrieves authenticated user's company information
- **Request**: No body required
- **Response**: Company object

<h4 id="company-register">POST /</h4>

Creates new company with user as administrator
- **Request**: name, cnpj, address
- **Response**: Company object with generated ID

<h4 id="company-list-employees">GET /list-employees</h4>

Lists all company employees and administrator
- **Request**: No body required
- **Response**: Array of user objects

<h4 id="company-update">[Admin Only] PUT /</h4>

Updates company information
- **Request**: name, cnpj, address
- **Response**: Updated company object

<h4 id="company-update-logo">[Admin Only] PATCH /update-logo</h4>

Updates or removes company logo
- **Request**: logo file (multipart/form-data)
- **Response**: Updated company object

<h4 id="company-hire-employee">[Admin Only] PATCH /hire-employee/:employeeId</h4>

Associates user with company
- **Request**: Employee ID via URL parameter
- **Response**: Updated employee object

<h4 id="company-fire-employee">[Admin Only] PATCH /fire-employee/:employeeId</h4>

Removes employee from company
- **Request**: Employee ID via URL parameter
- **Response**: No content

<h4 id="company-delete">[Admin Only] DELETE /</h4>

Deletes company and dissociates all employees
- **Request**: No body required
- **Response**: No content

<h3 id="products-routes">Product Routes (/products)</h3>

<h4 id="products-list">GET /</h4>

Retrieves all company products
- **Request**: No body required
- **Response**: Array of product objects

<h4 id="products-add">POST /</h4>

Adds new product to company catalog
- **Request**: name, price, quantity, brand, barCode (optional), image (optional)
- **Response**: Product object with generated ID

<h4 id="products-update">PUT /:productId</h4>

Updates existing product information
- **Request**: name, price, quantity, brand, barCode (optional)
- **Response**: Updated product object

<h4 id="products-update-image">PATCH /update-image/:productId</h4>

Updates or removes product image
- **Request**: image file (multipart/form-data)
- **Response**: Updated product object

<h4 id="products-delete">DELETE /:productId</h4>

Removes product from catalog
- **Request**: Product ID via URL parameter
- **Response**: No content

<h3 id="sales-routes">Sales Routes (/sales)</h3>

<h4 id="sales-employee">GET /employee/:employeeId</h4>

Retrieves all sales made by specific employee
- **Request**: Employee ID via URL parameter
- **Response**: Array of sale objects

<h4 id="sales-day">GET /day/:day-:month-:year</h4>

Retrieves sales for specific date
- **Request**: Date via URL parameters (DD-MM-YYYY format)
- **Response**: Array of sale objects

<h4 id="sales-week">GET /week/:day-:month-:year</h4>

Retrieves sales for 7-day period starting from specified date
- **Request**: Start date via URL parameters (DD-MM-YYYY format)
- **Response**: Array of sale objects

<h4 id="sales-month">GET /month/:day-:month-:year</h4>

Retrieves sales for 30-day period starting from specified date
- **Request**: Start date via URL parameters (DD-MM-YYYY format)
- **Response**: Array of sale objects

<h4 id="sales-create">POST /</h4>

Records new product sale
- **Request**: productId, method, quantity
- **Response**: Sale object with calculated total price

<h4 id="sales-update">PUT /:saleId</h4>

Updates existing sale record
- **Request**: productId, method, quantity
- **Response**: Updated sale object

<h4 id="sales-delete">DELETE /:saleId</h4>

Removes sale record
- **Request**: Sale ID via URL parameter
- **Response**: No content

<br/>

<h2 id="license">📝 License</h2>
This project is MIT Licensed. See <a href="https://github.com/RiadOliveira/Tradelous-backend/blob/main/LICENSE">LICENSE</a> file for more details.

<br/>

<h2 id="author">👨‍💻 Author</h2>

<kbd>
 <a href="https://github.com/RiadOliveira">
   <img src="https://avatars.githubusercontent.com/u/69125013?v=4" width="100" alt="Ríad Oliveira"/>
   <br/><br/>
   <p align="center"><b>Ríad Oliveira</b></p>
 </a>
</kbd>

## 🌐 Socials

<div id="socials">
  <a href="https://portfolio-riadoliveira.vercel.app"><img class="badge" src="https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=firefox&logoColor=#FF7139" alt="Portfolio" target="_blank"></a>
  <a href = "mailto:riad.oliveira@hotmail.com"><img class="badge" src="https://img.shields.io/badge/Microsoft_Outlook-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white" alt="E-mail" target="_blank"/></a>
  <a href = "mailto:riad.oliveira@gmail.com"><img class="badge" src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" target="_blank"/></a>
  <a href="https://www.linkedin.com/in/ríad-oliveira" target="_blank"><img class="badge" src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin" target="_blank"/></a>
</div>
