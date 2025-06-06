# Job Portal Application

A full-featured job portal website for South African job seekers and recruiters.

## Features

- User authentication (login/signup)
- Job posting functionality
- Job search and filtering
- CV uploads
- Responsive design
- MySQL database integration

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT

## Deployment Instructions

1. Create an account on [Render](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Fill in the following details:
   - Name: job-portal (or your preferred name)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add the following environment variables:
   - `DB_HOST`: Your database host
   - `DB_USER`: Your database user
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your database name
   - `JWT_SECRET`: Your JWT secret key

## Local Development

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the required environment variables
4. Run `npm run dev` for development
5. Run `npm start` for production

## Environment Variables

Create a `.env` file in the root directory with:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

## License

ISC
#   c l o s e  
 