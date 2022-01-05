<h1 align="center">Tradelous (Backend)</h1>

<p align="center">
  Backend of Tradelous application, created in order to manage and provide users (employees and admins), companies, products and sales to front-end application. I have decided to create this application in order to practice my backend development skills.
</p>

<h4 align="center">
	:convenience_store:&nbsp; Tradelous :heavy_check_mark: Finished &nbsp; :convenience_store: </br>
</h4>

![image](https://img.shields.io/github/license/RiadOliveira/Tradelous-backend)

Contents
=================
<!--ts-->
   * [🛠 Technologies](#technologies)
   * [:computer: Install & Run](#install&run)
      * [Prerequisites](#prerequisites)
      * [Running the server](#running)
      * [Testing API](#testing)
   * [:floppy_disk: Entities](#entities)
      * [User](#entity-user)
      * [Company](#entity-company)
      * [Product](#entity-product)
      * [Sale](#entity-sale)
   * [:gear: API Routes](#routes)
      * [User](#user-routes)
      * [Company](#company-routes)
      * [Products](#products-routes)
      * [Sales](#sales-routes)
   * [:man: Author](#author)
<!--te-->
</br>

<h2 id="technologies">🛠 Technologies</h2>
Tools used on this project:

- [Node.js](https://nodejs.org/en/)
- [Postgresql](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/) </br></br>

<h2 id="install&run">:computer: Install & Run</h2>

<ul>
  <li id="prerequisites"><h3>Prerequisites</h3></li>

  Before you start, it will be necessary to install those tools on your machine: [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Postgresql](https://www.postgresql.org/).

  <li id="running"><h3>Running the server</h3></li>

  ```bash
    # Clone this repository
    $ git clone <https://github.com/RiadOliveira/Tradelous-backend.git>

    # Install the dependecies
    $ npm install
    or
    $ yarn

    # Fill enviroment variables and ormconfig
        # The project has two example files in order to facilitate that: .env.example and ormconfig.example.json;

        # In first place, remove the .example part of those files, the .env variables are all ready to test the
        # server, but you can modify some redis' settings or the APP_SECRET (Used to generate jwtTokens).

        # On ormconfig, you will need to add the login settings of your database, indicating username, password
        # and database's name, as shown on example:
            "username": "postgres",
            "password": "tradelous",
            "database": "tradelous",

    # Create entities on database (with postgresql database running on background)
    $ npm run typeorm migration:run
    or
    $ yarn typeorm migration:run

    # Run the server
    $ npm run dev
    or
    $ yarn dev
  ```

  <li id="testing"><h3>Testing API</h3></li>

  In order to facilitate API tests, here is a [Insomnia](https://insomnia.rest) file (JSON format) containing all possible requests to call the API:
  [tradelous-insomnia.json](https://github.com/RiadOliveira/Tradelous-backend/blob/main/tradelous-insomnia.json).
</ul>

</br>

<h2 id="entities">:floppy_disk: Entities</h2>

- <h3 id="entity-user">User</h3>

  - id: UUID
  - name: string
  - email: string
  - password: string
  - isAdmin: boolean (Always false if user isn't associated to a <a href="#entity-company">company</a>)
  - companyId: UUID/null (ID of the <a href="#entity-company">company</a>)
  - avatar: string/null (name of the file)

- <h3 id="entity-company">Company</h3>

  - id: UUID
  - name: string
  - cnpj: number
  - address: string
  - logo: string/null (name of the file)
  - adminId: string (ID from an <a href="#entity-user">user</a>)

- <h3 id="entity-product">Product</h3>

  - id: UUID
  - name: string
  - companyId: UUID (ID of the <a href="#entity-company">company</a>)
  - price: number
  - quantity: number
  - brand: string
  - barCode: string/null
  - image: string/null (name of the file)

- <h3 id="entity-sale">Sale</h3>

  - id: UUID
  - companyId: UUID (ID of the <a href="#entity-company">company</a>)
  - employeeId: UUID (ID of the <a href="#entity-user">user</a> who made the sale)
  - productId: UUID (ID of the <a href="#entity-product">product</a> sold)
  - date: Date (Automatically setted to current date)
  - method: string (Can be 'money' or 'card')
  - totalPrice: number (Price of product multiplied by sale's quantity)

</br>

<h2 id="routes">:gear: API Routes</h2>

- <h3 id="user-routes">User (/user)</h3>

  - **SignUp (POST, /sign-up): Creates an <a href="#entity-user">user</a>.**
    - Request: name, email, password and confirmPassword (avatar only can be added to <a href="#entity-user">user</a> after the accounts creation).
    - Response: Object with created <a href="#entity-user">user</a>'s data (except password), including his id, createdAt and updatedAt.
  - **Sessions (POST, /sessions): Create a session of some <a href="#entity-user">user</a>, generating a token for his authentication.**
    - Request: email and password.
    - Response: Object containing two information: <a href="#entity-user">user</a> (an object containing all <a href="#entity-user">user</a> data, except for his password) and token (a string containing the generated token for authentication).
  - **Forgot Password (POST, /forgot-password): Sends an email containing a recovery token (It has no expiration date, but can be used just one time) for the requested <a href="#entity-user">user</a>.**
    - Request: email.
    - Response: No content, given that this is a training project, that route isn't sending real e-mails, it uses ethereal to simulate it, it's possible to see the email model using a link that appears on console of backend when that route is used.
  - **Recover Password (POST, /recover-password): Receive the recovery token and updates <a href="#entity-user">user</a>'s password if the token is valid.**
    - Request: confirmEmail, newPassword, confirmPassword (the new one), recoverToken (string).
    - Response: No content.
  - **Update (PUT): Updates authenticated <a href="#entity-user">user</a>.**
    - Request: Required (name, email), optional (oldPassword, newPassword, confirmPassword).
    - Response: Object containing updated <a href="#entity-user">user</a>'s data.
  - **Update Avatar (PATCH, /update-avatar): Updates/removes <a href="#entity-user">user</a>'s avatar.**
    - Request: avatar (field containing avatar's file). If nothing is passed and the authenticated <a href="#entity-user">user</a> has an avatar, deletes the avatar from disk and it's data on database.
    - Response: Object containing updated <a href="#entity-user">user</a>'s data with (or without) his avatar.
  - **Leave Company (PATCH, /leave-company): Dissociate the authenticated <a href="#entity-user">user</a> of his <a href="#entity-company">company</a> (Is he is associated to one, cannot be used for an admin).**
    - Request: No Body.
    - Response: No Content.
  - **Delete (DELETE): Deletes authenticated <a href="#entity-user">user</a>. If he is an admin of a <a href="#entity-company">company</a>, the <a href="#entity-company">company</a> is also deleted.**
    - Request: No Body.
    - Response: No Content.

</br>

- <h3 id="company-routes">Company (/company)</h3>

  - **Show (GET): Gets <a href="#entity-company">company</a>'s data from authenticated <a href="#entity-user">user</a> (Without employees data).**
    - Request: No Body.
    - Response: Object containing <a href="#entity-company">company</a>'s data.
  - **Register (POST): Creates a <a href="#entity-company">company</a> with autenticated <a href="#entity-user">user</a> as its admin (isAdmin property of <a href="#entity-user">user</a> is updated to true).**
    - Request: name, cnpj and address (logo only can be added to the <a href="#entity-company">company</a> after its creation).
    - Response: Object with created <a href="#entity-company">company</a>'s data, including its id, adminId, createdAt and updatedAt.
  - **List Employees (GET, /list-employees): Gets all employees (and admin) from authenticated <a href="#entity-user">user</a>'s <a href="#entity-company">company</a>.**
    - Request: No Body.
    - Response: Array of <a href="#entity-user">users</a> containing all employees and the admin of the <a href="#entity-company">company</a>.
  - **Update [Admin] (PUT): Updates <a href="#entity-company">company</a>'s data.**
    - Request: name, cnpj and address.
    - Response: Object containing updated <a href="#entity-company">company</a>'s data.
  - **Update Logo [Admin] (PATCH, /update-logo): Updates/removes <a href="#entity-company">company</a>'s logo.**
    - Request: logo (field containing logo's file). If nothing is passed and the <a href="#entity-company">company</a> has a logo, deletes the logo from disk and it's data on database.
    - Response: Object containing updated <a href="#entity-company">company</a>'s data with (or without) its logo.
  - **Hire Employee [Admin] (PATCH, /hire-employee/:employeeId): Associates an <a href="#entity-user">user</a> to admin's <a href="#entity-company">company</a>, updating companyId of the hired <a href="#entity-user">user</a>.**
    - Request: No Body (The employee id is passed through params).
    - Response: Object containing the hired <a href="#entity-user">user</a>, with his companyId updated.
  - **Fire Employee [Admin] (PATCH, /fire-employee/:employeeId): Dissociate an <a href="#entity-user">user</a> of admin's <a href="#entity-company">company</a>, setting companyId, of fired <a href="#entity-user">user</a>, as null.**
    - Request:  No Body (The employee id is passed through params).
    - Response: No Content.
  - **Delete [Admin] (DELETE): Deletes admin's <a href="#entity-company">company</a>. Sets companyId of all employees (including admin) as null (isAdmin property of admin is updated to false).**
    - Request: No Body.
    - Response: No Content.

</br>

- <h3 id="products-routes">Products (/products)</h3>

  - **List (GET): Gets all <a href="#entity-product">products</a> from authenticated <a href="#entity-user">user</a>'s <a href="#entity-company">company</a>.**
    - Request: No Body.
    - Response: Array of <a href="#entity-product">products</a> from the <a href="#entity-company">company</a>.
  - **Add (POST): Create a <a href="#entity-product">product</a> and associate it to authenticated <a href="#entity-user">user</a>'s <a href="#entity-company">company</a>.**
    - Request: name, price, quantity, brand, barCode (optional) and image (optional, field containing <a href="#entity-product">product</a>'s image file).
    - Response: Object with created <a href="#entity-product">product</a>'s data, including its id, companyId, createdAt and updatedAt.
  - **Update (PUT, /:productId): Updates data of the <a href="#entity-product">product</a> passed through params.**
    - Request: name, price, quantity, brand, barCode (optional).
    - Response: Object containing updated <a href="#entity-product">product</a>'s data.
  - **Update Image (PATCH, /update-image/:productId): Updates/removes image of the <a href="#entity-product">product</a> passed through params.**
    - Request: image (field containing logo's file). If nothing is passed and the <a href="#entity-product">product</a> has an image, deletes the image from disk and it's data on database.
    - Response: Object containing updated <a href="#entity-product">product</a>'s data with (or without) its image.
  - **Delete (DELETE, /:productId): Deletes the <a href="#entity-product">product</a> passed through params.**
    - Request: No Body.
    - Response: No Content.

</br>

- <h3 id="sales-routes">Sales (/sales)</h3>

  - **List from Employee (GET, /employee/:employeeId): Gets all <a href="#entity-sale">sales</a> made by the employee passed through params.**
    - Request: No Body.
    - Response: Array of <a href="#entity-sale">sales</a> made by passed employee.
  - **List on Day (GET, /day/:day-:month-:year): Gets all <a href="#entity-sale">sales</a> on determined date. The date is passed on the format day-month-year (brazilian pattern), using params.**
    - Request: No Body, date is passed through params.
    - Response: Array of <a href="#entity-sale">sales</a> made on passed date.
  - **List on Week (GET, /week/:day-:month-:year): Gets all <a href="#entity-sale">sales</a> on determined week, starting on passed day and getting all <a href="#entity-sale">sales</a> made six days after it (including <a href="#entity-sale">sales</a> made on start day). The date is passed on the format day-month-year (brazilian pattern), using params.**
    - Request: No Body, date is passed through params.
    - Response: Array of <a href="#entity-sale">sales</a> made on passed week.
  - - **List on Month (GET, /month/:day-:month-:year): Gets all <a href="#entity-sale">sales</a> on determined month, starting on passed day and getting all <a href="#entity-sale">sales</a> made twenty-nine days after it (including <a href="#entity-sale">sales</a> made on start day). The date is passed on the format day-month-year (brazilian pattern), using params.**
    - Request: No Body, date is passed through params.
    - Response: Array of <a href="#entity-sale">sales</a> made on passed month.
  - **Create (POST): Create a <a href="#entity-sale">sale</a> of determined <a href="#entity-product">product</a>.**
    - Request: productId, method, quantity.
    - Response: Object with created <a href="#entity-sale">sale</a>'s data, including its id, companyId, employeeId, date, totalPrice, createdAt and updatedAt.
  - **Update (PUT, /:saleId): Updates data of the <a href="#entity-sale">sale</a> passed through params.**
    - Request: productId, method, quantity.
    - Response: Object containing updated <a href="#entity-sale">sale</a>'s data.
  - **Delete (DELETE, /:saleId): Deletes the <a href="#entity-sale">sale</a> passed through params.**
    - Request: No Body.
    - Response: No Content.

</br>

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
