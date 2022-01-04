<h1 align="center">Tradelous (Backend)</h1>

<p align="center">
  Backend of tradelous application, created in order to manage and provide users, products and companies to front-end application. It was made mainly in order to pratice my development skills on backend.
</p>

<h4 align="center"> 
	:convenience_store:&nbsp; Tradelous :heavy_check_mark: Finished &nbsp; :convenience_store: </br>
</h4>

![image](https://img.shields.io/github/license/RiadOliveira/Tradelous-backend)

<h2 id="technologies">🛠 Technologies</h2>
Tools used on this project:

- [Node.js](https://nodejs.org/en/)
- [Postgresql](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/) </br></br>

<h2 id="entities">Entities</h2>

- <h3 id="entity-user">User</h3>

  - id: UUID
  - name: string
  - email: string
  - password: string
  - isAdmin: boolean
  - companyId: UUID
  - avatar: string (name of the file)

- <h3 id="entity-company">Company</h3>

  - id: UUID
  - name: string
  - cnpj: number
  - address: string
  - logo: string (name of the file)
  - adminId: string

- <h3 id="entity-product">Product</h3>

  - id: UUID
  - name: string
  - companyId: UUID
  - price: number
  - quantity: number
  - brand: string
  - barCode: string
  - image: string (name of the file)

- <h3 id="entity-sale">Sale</h3>

  - id: UUID
  - companyId: UUID
  - employeeId: UUID (Which made the sale)
  - productId: UUID (Product sold)
  - date: Date (Automatically setted to current date)
  - method: string (Can be 'money' or 'card')
  - totalPrice: number (Price of product multiplied by sale's quantity)

</br>

<h2 id="routes">:gear: API Routes</h2>

- <h3 id="user-routes">User (/user)</h3>

  - **SignUp (POST, /sign-up): Creates an user.**
    - Request: name, email, password, confirmPassword and isAdmin (avatar only can be added to user after the accounts creation).
    - Response: Object with created user's data (except password), including his id, createdAt and updatedAt.
  - **Sessions (POST, /sessions): Create a session of some user, generating a token for his authentication.**
    - Request: email and password.
    - Response: Object containing two information: user (an object containing all user data, except for his password) and token (a string containing the generated token for authentication).
  - **Forgot Password (POST, /forgot-password): Sends an email containing a recovery token (It has no expiration date, but can be used just one time) for the requested user.**
    - Request: email.
    - Response: No content, given that this is a training project, that route isn't sending real e-mails, it uses ethereal to simulate it, it's possible to see the email model using a link that appears on console of backend when that route is used.
  - **Recover Password (POST, /recover-password): Receive the recovery token and updates user's password if the token is valid.**
    - Request: confirmEmail, newPassword, confirmPassword (the new one), recoverToken (string).
    - Response: No content.
  - **Update (PUT): Updates authenticated user.**
    - Request: Required (name, email), optional (oldPassword, newPassword, confirmPassword).
    - Response: Object containing updated user's data.
  - **Update Avatar (PATCH, /update-avatar): Updates/removes user's avatar.**
    - Request: avatar (field containing avatar's file). If nothing is passed and the authenticated user has an avatar, deletes the avatar from disk and it's data on database.
    - Response: Object containing updated user's data with (or without) his avatar.
  - **Leave Company (PATCH, /leave-company): Dissociate the authenticated user of his company (Is he is associated to one, cannot be used for an admin).**
    - Request: No Body.
    - Response: No Content.
  - **Delete (DELETE): Deletes authenticated user. If he is an admin of a company, the company is also deleted.**
    - Request: No Body.
    - Response: No Content.
 
- <h3 id="company-routes">Company (/company)</h3>

  - **Show (GET): Gets company's data from authenticated user (Without employees data).**
    - Request: No Body.
    - Response: Object containing company's data.
  - **Register (POST): Creates a company with autenticated user as its admin.**
    - Request: name, cnpj and address (logo only can be added to company after its creation).
    - Response: Object with created company's data, including its id, adminId, createdAt and updatedAt.
  - **List Employees (GET, /list-employees): Gets all employees (and admin) from the company of authenticated user**
    - Request: No Body.
    - Response: Array containing one employee object on each position (And admin's object).
  - **Update [Admin] (PUT): Updates company's data.**
    - Request: name, cnpj and address.
    - Response: Object containing updated company's data.
  - **Update Logo [Admin] (PATCH, /update-logo): Updates/removes company's logo.**
    - Request: logo (field containing logo's file). If nothing is passed and the company has a logo, deletes the logo from disk and it's data on database.
    - Response: Object containing updated company's data with (or without) its logo.
  - **Hire Employee [Admin] (PATCH, /hire-employee/:employeeId): Associates an user to admin's company, updating companyId of the hired user.**
    - Request: No Body (The employee id is passed through params).
    - Response: Object containing the hired user, with his companyId updated.
  - **Fire Employee [Admin] (PATCH, /fire-employee/:employeeId): Dissociate an user of admin's company, setting companyId, of fired user, as null.**
    - Request:  No Body (The employee id is passed through params).
    - Response: No Content.
  - **Delete [Admin] (DELETE): Deletes admin's company. Sets companyId of all employees (including admin) as null.**
    - Request: No Body.
    - Response: No Content. 

<h2 id="author">:man: Author</h2>

---
<a href="https://github.com/RiadOliveira">
 <img src="https://avatars.githubusercontent.com/u/69125013?v=4;" width="100px;" alt=""/>
 <br/>
 <sub><b>Ríad Oliveira</b></sub>
</a>

</br>Contact:</br>

[![Linkedin Badge](https://img.shields.io/badge/-Ríad&nbsp;Oliveira-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/r%C3%ADad-oliveira-8492891b4/)](https://www.linkedin.com/in/r%C3%ADad-oliveira-8492891b4/) 
[![Gmail Badge](https://img.shields.io/badge/-riad.oliveira@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:riad.oliveira@gmail.com)](mailto:riad.oliveira@gmail.com)
