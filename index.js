// import express from 'express'
// import cors from 'cors'

// import { AdminRouter } from './Routes/AdminRoute.js'
// import { UserRouter } from './Routes/UserRoute.js'
// import { AuthRouter } from './Routes/AuthRoute.js'
// import cookieParser from 'cookie-parser';
// import conn from './utils/db.js'
//  // Add this line to parse cookies
//  //origin:'https://ems-frontend-ivory.vercel.app',
// const app = express()
// app.use(cors({
//   origin:'https://ems-frontend-ivory.vercel.app',
//     methods:['GET','POST','PUT','DELETE'],
//     credentials: true
// }))
// app.use(cookieParser()); 
// app.use(express.json())
// app.use('/admin', AdminRouter)
// app.use('/user',UserRouter)
// app.use('/auth',AuthRouter)
// app.use(express.static('public'))

// // Example of protecting a route (middleware to check token)
// app.use('/admin', (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
//       if (err || decoded.role !== 'admin') {
//         return res.status(403).json({ message: 'Not authorized' });
//       }
//       next(); // Allow access to the route if admin
//     });
//   });

//   // app.use((req, res, next) => {
//   //   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//   //   if (token) {
//   //     jwt.verify(token, 'your_jwt_secret', (err, user) => {
//   //       if (err) return res.status(403).send('Forbidden');
//   //       req.user = user;  // Set user data to the request object
//   //       next();
//   //     });
//   //   } else {
//   //     return res.status(401).send('Unauthorized');
//   //   }
//   // });
  
//   // Your 404 handler
//   app.use((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
//   });
  
//   // Start the server
//   const PORT = process.env.PORT || 3001;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     conn.ping((err)=> console.log(err))
//   });
// // app.listen(3000, ()=> {
// //     console.log("Server is running!");
    
// // })

import express from 'express'
import cors from 'cors'

import { AdminRouter } from './Routes/AdminRoute.js'
import { UserRouter } from './Routes/UserRoute.js'
import { AuthRouter } from './Routes/AuthRoute.js'
import cookieParser from 'cookie-parser';
import conn from './utils/db.js'
 // Add this line to parse cookies
const app = express()
app.use(cors({
    origin:'https://ems-frontend-ivory.vercel.app',
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
  app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
  // app.use((req, res, next) => {
  //   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  //   if (token) {
  //     jwt.verify(token, 'your_jwt_secret', (err, user) => {
  //       if (err) return res.status(403).send('Forbidden');
  //       req.user = user;  // Set user data to the request object
  //       next();
  //     });
  //   } else {
  //     return res.status(401).send('Unauthorized');
  //   }
  // });
  
  // Your 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  

//   // Start the server
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    conn.ping((err) => {
      if (err) {
        console.error('Database connection failed:', err);
      } else {
        console.log('Database connection is alive');
      }
    });
  });
// app.listen(3000, ()=> {
//     console.log("Server is running!");
    
// })