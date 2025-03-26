# Fed Storefront Backend

This is the backend for the Fed Storefront, an e-commerce platform that allows users to browse products, place orders, and manage their accounts. The backend is built using Node.js, Express, MongoDB, and Clerk for authentication.

🔗 **Live Website:** [FED Storefront](https://fed-storefront-backend-sachitha.netlify.app)    
🔗 **Frontend:** [FED Storefrontend](https://github.com/SachithaEshan/fed-frontend)

## Features
- User authentication and authorization using Clerk
- Product management (CRUD operations)
- Order creation and management
- Address handling
- Secure payment processing
- Inventory management

## Tech Stack
- **Node.js** - Server-side runtime
- **Express.js** - Backend framework
- **MongoDB & Mongoose** - Database & ODM
- **Clerk** - Authentication
- **Zod** - Schema validation
- **JWT** - Token-based authentication
- **Multer** - File uploads

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/SachithaEshan/fed-Back-End.git
   cd fed-Back-End
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure the following environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Add a new product
- `GET /api/products/:id` - Get a product by ID
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Orders
- `POST /api/orders` - Create an order
- `GET /api/orders` - Get user orders

### Addresses
- `POST /api/addresses` - Add an address
- `GET /api/addresses` - Get user addresses

## Contributing
1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any issues or inquiries, feel free to reach out!

Happy coding! 🚀

