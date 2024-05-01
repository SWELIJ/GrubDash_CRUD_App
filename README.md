## GrubDash API: Summary and Instructions

This is a summary of the GrubDash API project, including its goals, tasks, and how to run it locally.

**Project Goal:**

Build an API with complex validation for managing dishes and orders for a food delivery app.

**Tasks:**

- Implement routes for managing dishes (CRUD - Create, Read, Update, and List).
- Implement routes for managing orders (CRUDL - Create, Read, Update, Delete, and List).
- Utilize middleware functions for validation and error handling.
- Follow RESTful design principles.

**Running the Project:**

1. **Download Files:** Ensure you have downloaded the project files.
2. **Install Dependencies:** Run `npm install` in the project directory to install required dependencies.
3. **Initialize Git (Optional):** Run `git init` to initialize a Git repository for version control (optional).
4. **Run Tests (Optional):** Run `npm test` to execute the project's tests (optional). 

**Important Notes:**

- Use Node.js version 18 (`node -v`).
- Refer to the `README.md` file in the project directory for detailed instructions.
- You are not required to connect the API to a frontend for this project.
- Maintainability and code clarity are crucial.

**API Endpoints:**

**Dishes:**

* **GET /dishes:** Lists all dishes.
* **POST /dishes:** Creates a new dish.
* **GET /dishes/:dishId:** Retrieves a specific dish by ID.
* **PUT /dishes/:dishId:** Updates a dish by ID.

**Orders:**

* **GET /orders:** Lists all orders.
* **POST /orders:** Creates a new order.
* **GET /orders/:orderId:** Retrieves a specific order by ID.
* **PUT /orders/:orderId:** Updates an order by ID.
* **DELETE /orders/:orderId:** Deletes an order by ID (only allowed for pending orders).

**Validation:**

- Enforce validation rules for dish and order data (refer to the provided detailed instructions for specific validation criteria).

**Error Handling:**

- Implement proper error handling with appropriate status codes and messages.

**RESTful Design:**

- Adhere to RESTful principles for a well-structured API.

