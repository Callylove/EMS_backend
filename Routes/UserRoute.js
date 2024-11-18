// import express from 'express'
// import conn from '../utils/db.js'
// import jwt from 'jsonwebtoken'

// const router = express.Router()

// router.post('/login', (req,res)=>{
//     const sql = "SELECT * from users where email = ? and password = ?"
//     conn.query(sql,[req.body.email,req.body.password], (err,result) =>{
//         if (err) return res.json({loginStatus: false, Error:'Query Error'})
//         if (result.length > 0) {
//             const email  = result[0].email
//             const token = jwt.sign({role:'user', email:email}, 'jwt_secret_key',{expiresIn: '1d'})
//             res.cookie('token',token)
//             return res.json({loginStatus: true,role:'user',})
//         }else {
//             return res.json({loginStatus: false,  Error:'Wrong Email or Password'})
//         }
//     })
    
// })

// export {router as UserRouter}

import express from 'express'
import conn from '../utils/db.js'
import jwt from 'jsonwebtoken'
import {upload} from '../utils/uploads.js';
import bcrypt from 'bcryptjs'

const router = express.Router()

// Middleware to protect user routes
router.use('/dashboard', (req, res, next) => {
    console.log(res.body);
    
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err || decoded.role !== 'user') {
      return res.status(403).json({ message: 'Not authorized as user',Result: decoded.role });
    }
    next(); // Allow access to the route if user
  });
});


// Register route
// router.post('/register', upload.single('image'), (req, res) => {
//   const { fullname, email, phone, password, emp_id, nin, category_id, salary } = req.body;
//   const image = req.file ? req.file.filename : null; // Get the uploaded image filename
//   const generateEmployeeId = () => {
//     const prefix = 'EMS-';
//     const randomString = Math.random().toString(36).substr(2, 10); // 10-character random string
//     return prefix + randomString;
//   };

//   const employee_id = generateEmployeeId(); // Generate unique employee_id
//   // Insert into the employees table
//   const employeeSql = `INSERT INTO employees (fullname, email, phone, password, emp_id, nin, category_id, salary, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   conn.query(employeeSql, [fullname, email, phone, password, employee_id, nin, category_id, salary, image], (err, result) => {
//     if (err) {
//       console.error('Error inserting into employees table:', err);
//       return res.json({ Status: false, error: 'Failed to register employee'});
//     }

//     // Insert into the users table (same credentials for login)
//     const userSql = `INSERT INTO users (email, password) VALUES (?, ?)`;
//     conn.query(userSql, [email, password], (err, userResult) => {
//       if (err) {
//         console.error('Error inserting into users table:', err);
//         return res.json({ Status: false, error: 'Failed to register user' });
//       }
//      console.log(userResult.data);
     
//       return res.json({ Status: true, message: 'User registered successfully' });
//     });
//   });
// });
router.post('/register', upload.single('image'), (req, res) => {
  const { fullname, email, phone, password, emp_id, nin, category_id, salary } = req.body;
  const image = req.file ? req.file.filename : null; // Get the uploaded image filename

  // Generate a unique employee ID
  const generateEmployeeId = () => {
    const prefix = 'EMS-';
    const randomString = Math.random().toString(36).substr(2, 10); // 10-character random string
    return prefix + randomString;
  };

  const employee_id = generateEmployeeId(); // Generate unique employee_id

  // Hash the password before inserting into the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.json({ Status: false, error: 'Failed to hash password' });
    }

    // Insert into the employees table
    const employeeSql = `INSERT INTO employees (fullname, email, phone, password, emp_id, nin, category_id, salary, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    conn.query(employeeSql, [fullname, email, phone, hashedPassword, employee_id, nin, category_id, salary, image], (err, result) => {
      if (err) {
        console.error('Error inserting into employees table:', err);
        return res.json({ Status: false, error: 'Failed to register employee' });
      }

      // Insert into the users table with the hashed password
      const userSql = `INSERT INTO users (email, password) VALUES (?, ?)`;
      conn.query(userSql, [email, hashedPassword], (err, userResult) => {
        if (err) {
          console.error('Error inserting into users table:', err);
          return res.json({ Status: false, error: 'Failed to register user' });
        }

        // Successful registration
        return res.json({ Status: true, message: 'User registered successfully' });
      });
    });
  });
});

// Middleware to verify token and get user info
const verifyToken = (req, res, next) => {
  const token = req.cookies.token 
  console.log(token);
  

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.user = decoded; // Store the decoded user data in the request
    console.log(req.user);
    
    next(); // Pass control to the next handler
  });
};

// Get user details
// router.get('/details', (req, res) => {
//   const userId = req.user.userId;
//   console.log(userId);
  

//   // Query the employee table (or any other relevant table) to get user details
//   const sql = 'SELECT * FROM employees WHERE id = ?'; // Assuming `user_id` exists in employees table
//   conn.query(sql, [userId], (err, results) => {
//     if (err) {
//       return res.json({ error: 'Database error' });
//     }

//     if (results.length > 0) {
//       return res.json({
//         Status: true,
//         user: results[0] // Send the user details to the frontend
//       });
//     } else {
//       return res.json({ error: 'User not found' });
//     }
//   });
// });
// Route to get user details (protected route)
router.get('/details', verifyToken, (req, res) => {
  const email = req.user.email; 
  // console.log('User ID from Token:', email); // Check if this prints correctly


  const sql = 'SELECT * FROM employees WHERE email = ?';
  conn.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({Status: false, error: 'Database error' });
    }

    if (results.length > 0) {
      return res.json({
        Status: true,
        user: results[0], 
      });
    } else {
      return res.status(404).json({Status:false, error: 'User not found'});
    }
  });
});

// Route to update the user profile with documents
// router.post('/updateProfile', upload.fields([
//   { name: 'waec', maxCount: 1 },
//   { name: 'jamb', maxCount: 1 },
//   { name: 'employmentLetter', maxCount: 1 },
//   { name: 'degree', maxCount: 1 }
// ]), (req, res) => {
//   // const userId = req.user.userId; // Assuming user ID is available in req.user (from JWT authentication)
//   const { age, placeOfWork, jobTitle, jobType } = req.body;
//   console.log(req.body);
  

//   // Collect file paths for the uploaded documents (if any)
//   const waec = req.files['waec'] ? req.files['waec'][0].filename : null;
//   const jamb = req.files['jamb'] ? req.files['jamb'][0].filename : null;
//   const employmentLetter = req.files['employmentLetter'] ? req.files['employmentLetter'][0].filename : null;
//   const degree = req.files['degree'] ? req.files['degree'][0].filename : null;

//   // SQL query to update the user's profile information
//   const sql = `
//     UPDATE employees 
//     SET 
//       age = ?, 
//       placeOfWork = ?, 
//       jobTitle = ?, 
//       jobType = ?, 
//       waec = ?, 
//       jamb = ?, 
//       employmentLetter = ?,
//       degree = ?
//     WHERE id = ?
//   `;
  
//   const values = [
//     age, 
//     placeOfWork, 
//     jobTitle, 
//     jobType, 
//     waec, 
//     jamb, 
//     employmentLetter, 
//     degree
 
//   ];
//   // Execute the query to update the user's profile
//   conn.query(sql, [...values], (err, results) => {
//     if (err) {
//       console.error('Error updating user profile:', err);
//       return res.status(500).json({ Status: false, error: 'Database error' });
//     }

//     if (results.affectedRows > 0) {
//       return res.status(200).json({ Status: true, message: 'Profile updated successfully' });
//     } else {
//       return res.status(404).json({ Status: false, message: 'User not found or no changes made' });
//     }
//   });
// });
// POST route for updating user profile
router.post('/updateProfile/:id', upload.fields([
  { name: 'waec', maxCount: 1 },
  { name: 'jamb', maxCount: 1 },
  { name: 'employmentLetter', maxCount: 1 },
  { name: 'degree', maxCount: 1 },
  {name: 'jobTerminate', maxCount: 1}
]), (req, res) => {
  // Assuming user ID is available in req.user after successful JWT authentication
  const {id} = req.params
  // const userId = req.user;  // Ensure that the userId is set correctly

  

  if (!id) {
    return res.status(400).json({ Status: false, error: 'User not authenticated' });
  }

  // Extract the form data from req.body
  const { age, placeOfWork, jobTitle, jobType } = req.body;

  // Log body to see the data
  console.log(req.body);

  // Collect the file paths for the uploaded documents (if any)
  const waec = req.files['waec'] ? req.files['waec'][0].filename : null;
  const jamb = req.files['jamb'] ? req.files['jamb'][0].filename : null;
  const employmentLetter = req.files['employmentLetter'] ? req.files['employmentLetter'][0].filename : null;
  const degree = req.files['degree'] ? req.files['degree'][0].filename : null;
  const jobTerminate = req.file['jobTerminate'] ? req.files['jobTerminate'][0].filename : null

  // SQL query to update the user's profile information
  const sql = `
    UPDATE employees 
    SET 
      age = ?, 
      placeOfWork = ?, 
      jobTitle = ?, 
      jobType = ?, 
      waec = ?, 
      jamb = ?, 
      employmentLetter = ?,
      degree = ?,
      jobTerminate = ?
    WHERE id = ?;
  `;

  // Values to be passed into the SQL query
  const values = [
    age, 
    placeOfWork, 
    jobTitle, 
    jobType, 
    waec, 
    jamb, 
    employmentLetter, 
    degree, 
    jobTerminate,
    id // Ensure this is correctly passed for WHERE clause
  ];

  // Execute the query to update the user's profile
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ Status: false, error: 'Database error' });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ Status: true, message: 'Profile updated successfully' });
    } else {
      return res.status(404).json({ Status: false, message: 'User not found or no changes made' });
  }
 });
});
// const authenticateJWT = (req, res, next) => {
//   const token = req.cookies.token;  // Retrieve token from cookies

//   if (!token) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   try {
//     // Verify the token and decode it
//     const decoded = jwt.verify(token, 'jwt_secret_key');
//     req.user = decoded;  // Attach user information to the request
//     next();  // Proceed to the next route handler
//   } catch (error) {
//     return res.status(400).json({ error: 'Invalid or expired token' });
//   }
// };

// // Protect the /user/role route
// router.get('/role', authenticateJWT, (req, res) => {
//   const { role } = req.user;  // Extract role from decoded token
//   console.log(role);
  
//   return res.json({ role });
// });

//User dashboard route

router.get('/dashboard', (req, res) => {
    // If no token is found, return unauthorized error
    if (!token) {
      return res.status(403).json({ message: 'Not authorized' });
    }
  
    // Log the token to ensure it's being sent correctly
    // console.log('Token:', token);
  
    // Verify the token
    jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
      if (err) {
        // console.log('JWT verification error:', err);
        return res.status(403).json({ message: 'Not authorized, invalid token' });
      }
  
      // Log decoded token to ensure the contents are correct
      console.log('Decoded token:', decoded);
  
      // Check if the decoded role is 'admin'
      if (decoded.role !== 'user') {
        // console.log('Role:', decoded.role);  // Log role for debugging
        return res.status(403).json({ message: 'Not authorized as admin', role: decoded.role });
      }
  
      // All checks passed, send a response with the admin dashboard message
      return res.json({ message: 'Welcome to the User Dashboard', role: decoded.role });
    });

});

export {router as UserRouter}
