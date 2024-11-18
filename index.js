import express from 'express'
import cors from 'cors'

import { AdminRouter } from './Routes/AdminRoute.js'
import { UserRouter } from './Routes/UserRoute.js'
import { AuthRouter } from './Routes/AuthRoute.js'
import cookieParser from 'cookie-parser';
 // Add this line to parse cookies
const app = express()
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials: true
}))
app.use(cookieParser()); 
app.use(express.json())
app.use('/admin', AdminRouter)
app.use('/user',UserRouter)
app.use('/auth',AuthRouter)
app.use(express.static('public'))

// Example of protecting a route (middleware to check token)
app.use('/admin', (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
      if (err || decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      next(); // Allow access to the route if admin
    });
  });
  
  // Your 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// app.listen(3000, ()=> {
//     console.log("Server is running!");
    
// })