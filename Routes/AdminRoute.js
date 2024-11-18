// import express from 'express'
// import conn from '../utils/db.js'
// import jwt from 'jsonwebtoken'

// const router = express.Router()

// router.post('/login', (req,res)=>{
//     const sql = "SELECT * from admin where email = ? and password = ?"
//     conn.query(sql,[req.body.email,req.body.password], (err,result) =>{
//         if (err) return res.json({loginStatus: false, Error:'Query Error'})
//         if (result.length > 0) {
//             const email  = result[0].email
//             const token = jwt.sign({role:'admin', email:email}, 'jwt_secret_key',{expiresIn: '1d'})
//             res.cookie('token',token)
//             return res.json({loginStatus: true,role:'admin',})
//         }else {
//             return res.json({loginStatus: false,  Error:'Wrong Email or Password'})
//         }
//     })
    
// })

// export {router as AdminRouter}

import express from 'express'
import conn from '../utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {upload} from '../utils/uploads.js';
// import multer from 'multer'
// import path from 'path'
// import { fileURLToPath } from 'url'; 
// import fs from 'fs'
const router = express.Router()

// Middleware to protect admin routes
// router.use('/dashboard', (req, res, next) => {
  
    
//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(403).json({ message: 'Not authorized' });
//   }
//   console.log('Token:', token);
//   jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
//     if (err || decoded.role !== 'admin') {
//       console.log('JWT verification error:', err);
//       console.log(decoded.role);
      
//       return res.status(403).json({ message: 'Not authorized as admin', role: decoded.role });
//     }
//     next(); // Allow access to the route if admin
//   });
// });
router.use('/dashboard', (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Log the token to ensure it's being sent correctly
  console.log('Token:', token);
  
  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err) {
    
      return res.status(403).json({ message: 'Not authorized, invalid token' });
    }

   
    // Check the role to ensure it's 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    next(); // Allow access to the route if admin
  });
});
// POST route to add a category
router.post('/add_category', (req, res) => {
    const sql = 'INSERT INTO category (`name`) VALUES (?)';
    conn.query(sql, [req.body.category], (err, queryRes) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.json({ Status: false, error: 'Query Error' });
        }
        return res.json({ Status: true });
    });
});


router.post('/add_employee', upload.single('image'), (req, res) => {
  // // Log the form data and file to check if it's coming through correctly
  // console.log('Form data:', req.body);
  // console.log('File data:', req.file);  // This will contain file information

  const generateEmployeeId = () => {
    const prefix = 'EMS-';
    const randomString = Math.random().toString(36).substr(2, 10); // 10-character random string
    return prefix + randomString;
  };

  const employee_id = generateEmployeeId(); // Generate unique employee_id
  
  if (!req.file) {
    console.log('No file uploaded.');
  } else {
    console.log('File uploaded successfully:', req.file.filename);
  }

  // Access other form fields from req.body
  const { fullname, email, phone, password, emp_id, nin, salary, category_id } = req.body;

  // Handle missing required fields
  if (!fullname || !email || !password || !phone || !nin || !category_id || !salary) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // If file is uploaded, get its path, else set it as null
  const imagePath = req.file ? req.file.filename : null;

  // SQL query to insert employee data (ensure to include image path)
  const query = `
    INSERT INTO employees (emp_id, fullname, email, password, phone, nin, image, salary, category_id)
    VALUES ('${employee_id}', '${fullname}', '${email}', '${password}', '${phone}', '${nin}', '${imagePath}', '${salary}', '${category_id}')
  `;

  // Execute the query
  conn.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.json({ Status: false, error: 'Query Error' });
  }
  return res.json({ Status: true });
  });
});
router.get('/category', (req,res)=>{
    const sql = 'SELECT * from category'
    conn.query(sql, (err,result)=>{
        if (err) {
            console.error('Error executing query:', err);
            return res.json({ Status: false, error: 'Query Error' });
        }
        return res.json({ Status: true, Result: result });
    })
})
router.get('/employee', (req,res)=>{
  const sql = 'SELECT * from employees'
  conn.query(sql, (err,result)=>{
      if (err) {
          console.error('Error executing query:', err);
          return res.json({ Status: false, error: 'Query Error' });
      }
      return res.json({ Status: true, Result: result });
  })
})

router.get('/employee/:id', (req,res)=> {
  const {id} = req.params
 
  
  const sql = 'SELECT * from employees WHERE id = ?'
  conn.query(sql,[id], (err,result)=>{
      if (err) {
          console.error('Error executing query:', err);
          return res.json({ Status: false, error: 'Query Error' });
      }
      return res.json({ Status: true, Result: result });
  })
  
})
 
router.put('/edit_employee/:id', (req,res)=>{
  const {id} = req.params
  console.log(req.body);
  
  const sql = `UPDATE employees set fullname= ?, email= ?, nin= ?, category_id= ?, salary= ?, phone= ? WHERE id = ?`
  const values = [
    req.body.fullname, req.body.email, req.body.nin, req.body.category_id, req.body.salary, req.body.phone
  ]
  conn.query(sql,[...values, id], (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
router.delete('/delete_employee/:id',(req,res)=>{
  const {id} = req.params
  const sql = "DELETE from employees WHERE id = ?"
  conn.query(sql,[id], (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})

router.get('/admin_count', (req,res)=>{
  const sql = "SELECT count(id) as admin from admin"
  conn.query(sql, (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
router.get('/employee_count', (req,res)=>{
  const sql = "SELECT count(id) as employee from employees"
  conn.query(sql, (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
router.get('/salary_count', (req,res)=>{
  const sql = "SELECT sum(salary) as salary from employees"
  conn.query(sql, (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
router.get('/admin_records', (req,res)=>{
  const sql = "SELECT * from admin"
  conn.query(sql, (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
router.delete('/delete_admin/:id',(req,res)=>{
  const {id} = req.params
  const sql = "DELETE from admin WHERE id = ?"
  conn.query(sql,[id], (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
// router.get('/logout', (req,res)=>{
//   res.clearCookie('token')
//   return res.json({ Status: true});

// })
// Logout Route in Express.js
router.get('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', { httpOnly: true, path: '/' });

  // Send a response to the client that the logout was successful
  res.json({ Status: true });
});
router.put('/edit_admin/:id', (req,res)=>{
  const {id} = req.params
  console.log(req.body);
  
  const sql = `UPDATE admin set email= ? WHERE id = ?`
  const values = [
     req.body.email
  ]
  conn.query(sql,[...values, id], (err,result)=>{
    if (err) {
        console.error('Error executing query:', err);
        return res.json({ Status: false, error: 'Query Error' });
    }
    return res.json({ Status: true, Result: result });
})
})
//Admin dashboard route
// router.get('/dashboard', (req, res) => {
//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(403).json({ message: 'Not authorized' });
//   }

//   // Log the token to ensure it's being sent correctly
//   console.log('Token:', token);
  
//   jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
//     if (err) {
//       console.log('JWT verification error:', err);
//       return res.status(403).json({ message: 'Not authorized, invalid token' });
//     }

//     console.log('Decoded token:', decoded);

//     // Check the role to ensure it's 'admin'
//     if (decoded.role !== 'admin') {
//       console.log('Role:', decoded.role);  // Log role for debugging
//       return res.status(403).json({ message: 'Not authorized as admin', role: decoded.role });
//     }
//   })
//   res.json({ message: 'Welcome to the Admin Dashboard', role: decoded.role });
// });
router.get('/dashboard', (req, res) => {
  const token = req.cookies?.token;

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
    if (decoded.role !== 'admin') {
      // console.log('Role:', decoded.role);  // Log role for debugging
      return res.status(403).json({ message: 'Not authorized as admin', role: decoded.role });
    }

    // All checks passed, send a response with the admin dashboard message
    return res.json({ message: 'Welcome to the Admin Dashboard', role: decoded.role });
  });
});
export {router as AdminRouter}
