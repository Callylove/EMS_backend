

// import bcrypt from 'bcryptjs'
// import express from 'express'
// import conn from '../utils/db.js'
// import jwt from 'jsonwebtoken'

// const router = express.Router()
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Check if the email belongs to an admin
//   const adminSql = "SELECT * FROM admin WHERE email = ?";
//   conn.query(adminSql, [email, password], (err, adminResult) => {
//     if (err) {
//       return res.json({ loginStatus: false, error: 'Database error' });
//     }

//     // If the admin exists
//     if (adminResult.length > 0) {
//       const admin = adminResult[0];
//       console.log(admin);
      
//       // bcrypt.compare(password, admin.password, (err, isMatch) => {
//       //   if (err) {
//       //     return res.json({ loginStatus: false, error: 'Server error' });
//       //   }

//       //   if (isMatch) {
//       //     const token = jwt.sign({ role: 'admin', email: admin.email }, 'jwt_secret_key', { expiresIn: '1d' });
//       //     res.cookie('token', token, { httpOnly: true });
//       //     return res.json({ loginStatus: true, role: 'admin' });
//       //   } else {
//       //     return res.json({ loginStatus: false, error: 'Incorrect password' });
//       //   }
//       // });
//     } else {
//       // If it's not an admin, check if it's a user
//       const userSql = "SELECT * FROM users WHERE email = ?";
//       conn.query(userSql, [email], (err, userResult) => {
//         if (err) {
//           return res.json({ loginStatus: false, error: 'Database error' });
//         }

//         if (userResult.length > 0) {
//           const user = userResult[0];
//           console.log();
          
//           // bcrypt.compare(password, user.password, (err, isMatch) => {
//           //   if (err) {
//           //     return res.json({ loginStatus: false, error: 'Server error' });
//           //   }

//           //   if (isMatch) {
//           //     const token = jwt.sign({ role: 'user', email: user.email }, 'jwt_secret_key', { expiresIn: '1d' });
//           //     res.cookie('token', token, { httpOnly: true });
//           //     return res.json({ loginStatus: true, role: 'user' });
//           //   } else {
//           //     return res.json({ loginStatus: false, error: 'Incorrect password' });
//           //   }
//           // });
//         } else {
//           return res.json({ loginStatus: false, error: 'User not found' });
//         }
//       });
//     }
//   });
// });

// export {router as AuthRouter}

import express from 'express';
import conn from '../utils/db.js';  // Assuming this is your MySQL connection setup
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
const router = express.Router();

// router.post('/login', (req, res) => {

//   const { email, password } = req.body;

//   // Check if the email belongs to an admin
//   const adminSql = "SELECT * FROM admin WHERE email = ? AND password = ?";
//   conn.query(adminSql, [email, password], (err, adminResult) => {
//     if (err) {
//       return res.json({ loginStatus: false, error: 'Database error' });
//     }

//     // If the admin exists
//     if (adminResult.length > 0) {
//       const admin = adminResult[0];
//       const token = jwt.sign({ role: 'admin', email: admin.email }, 'jwt_secret_key', { expiresIn: '1d' });

//       // Set JWT token as a cookie (httpOnly for security)
//       res.cookie('token', token, { httpOnly: true });

//       return res.json({ loginStatus: true, role: 'admin' });
//     } else {
//       // If not an admin, check if it's a user
//       const userSql = "SELECT * FROM users WHERE email = ? AND password = ?";
//       conn.query(userSql, [email, password], (err, userResult) => {
//         if (err) {
//           return res.json({ loginStatus: false, error: 'Database error' });
//         }

//         if (userResult.length > 0) {
//           const user = userResult[0];
//           const token = jwt.sign({ role: 'user', email: user.email }, 'jwt_secret_key', { expiresIn: '1d' });

//           // Set JWT token as a cookie (httpOnly for security)
//           res.cookie('token', token, { httpOnly: true });

//           return res.json({ loginStatus: true, role: 'user' });
//         } else {
//           return res.json({ loginStatus: false, error: 'User not found or incorrect password' });
//         }
//       });
//     }
//   });
// });
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Check if the email belongs to an admin
//   const adminSql = "SELECT * FROM admin WHERE email = ? AND password = ?";
//   conn.query(adminSql, [email, password], (err, adminResult) => {
//     if (err) {
//       return res.json({ loginStatus: false, error: 'Database error' });
//     }

//     // If the admin exists
//     if (adminResult.length > 0) {
//       const admin = adminResult[0];
//       const token = jwt.sign({ role: 'admin', email: admin.email }, 'jwt_secret_key', { expiresIn: '1d' });

//       // Set JWT token as a cookie (httpOnly for security)
//       res.cookie('token', token, { httpOnly: true });

//       return res.json({ loginStatus: true, role: 'admin' });
//     } else {
//       // If not an admin, check if it's a user
//       const userSql = "SELECT * FROM users WHERE email = ? AND password = ?";
//       conn.query(userSql, [email, password], (err, userResult) => {
//         if (err) {
//           return res.json({ loginStatus: false, error: 'Database error' });
//         }

//         if (userResult.length > 0) {
//           const user = userResult[0];
//           const token = jwt.sign({ role: 'user', email: user.email }, 'jwt_secret_key', { expiresIn: '1d' });

//           // Set JWT token as a cookie (httpOnly for security)
//           res.cookie('token', token, { httpOnly: true });

//           return res.json({ loginStatus: true, role: 'user'});
//         } else {
//           return res.json({ loginStatus: false, error: 'User not found or incorrect password' });
//         }
//       });
//     }
//   });
// });

router.post('/login', (req, res) => {
    const { email, password } = req.body;

  // Check if the email belongs to an admin
  const adminSql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  conn.query(adminSql, [email, password], (err, adminResult) => {
    if (err) {
      return res.json({ loginStatus: false, error: 'Database error' });
    }

    // If the admin exists
    if (adminResult.length > 0) {
      const admin = adminResult[0];
      const token = jwt.sign({ role: 'admin', email: admin.email }, 'jwt_secret_key', { expiresIn: '1d' });
      return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌",loginStatus: true, role: 'admin'  });
      // Set JWT token as a cookie (httpOnly for security)
      // res.cookie('token', token);

      // return res.json({ loginStatus: true, role: 'admin' });
    } else {
      // If not an admin, check if it's a user
      const userSql = "SELECT * FROM users WHERE email = ?";
      conn.query(userSql, [email], (err, userResult) => {
        if (err) {
          return res.json({ loginStatus: false, error: 'Database error' });
        }

        if (userResult.length > 0) {
          const user = userResult[0];
          
          // Compare the provided password with the stored hashed password using bcrypt
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return res.json({ loginStatus: false, error: 'Error comparing password' });
            }
            
            if (isMatch) {
              // Password matches
              const token = jwt.sign({ role: 'user', email: user.email }, 'jwt_secret_key', { expiresIn: '1d' });

              // Set JWT token as a cookie (httpOnly for security)
              res.cookie('token', token);

              return res.json({ loginStatus: true, role: 'user' });
            } else {
              // Password doesn't match
              return res.json({ loginStatus: false, error: 'Incorrect password for user' });
            }
          });
        } else {
          return res.json({ loginStatus: false, error: 'User not found or incorrect password' });
        }
      });
    }
  });
});

// Middleware to verify JWT and get the role
function verifyToken(req, res, next) {
  const token = req.cookies.token; // JWT token is stored in the cookie
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the decoded role to the request object
    req.user = decoded; // { role: 'admin', email: 'user@example.com' }

    next(); // Proceed to the next middleware or route handler
  });
}

// Example of a route to get the role
router.get('/dashboard', verifyToken, (req, res) => {
  // const role = req.user.role; // From the decoded JWT payload
  // console.log(role);
  const user = req.user 
  console.log(user);
  if(user){
    return res.json({ user });
  }
else {
  return res.json({error:'error fetching role'})
}
  
});
// router.get('/dashboard', (req, res) => {
//   // const role = req.user.role; // From the decoded JWT payload
//   // console.log(role);
//   const token = req.cookies.token;
//   console.log(token);
  
//   jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }

//     // Attach the decoded role to the request object
//     req.user = decoded; // { role: 'admin', email: 'user@example.com' }
//     const user = req.user
//     console.log(user);
    
//     return res.json({ user });

//   })// Proceed to the next middleware or route handler
  
  
// //   if(user){
// //     return res.json({ user });
// //   }
// // else {
// //   return res.json({error:'error fetching role'})
// // }
  

// });
export { router as AuthRouter };
