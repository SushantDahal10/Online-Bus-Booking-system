    const express = require('express');
    const app = express();
    const connection = require('./connection'); 
    const cors = require('cors');
    const moment = require('moment');
    const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        }
      });
      const upload = multer({ storage });
    const nodemailer = require("nodemailer");
    const path = require('path');
    const bodyParser = require('body-parser');
    const session = require('express-session');
    const stripe = require('stripe')(process.env.STRIPE_KEY_BACKEND, {
        apiVersion: '2020-08-27',
    });
    const jwt=require('jsonwebtoken')
    const cookieParser = require('cookie-parser');
let temporarydata={};

app.use(express.json()); 
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    }));
    app.use(bodyParser.json());
    app.use(session({
        secret: process.env.SECRET_KEY_USER, 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    function generateToken(email) {
        return jwt.sign({ email }, process.env.SECRET_KEY_ADMIN, { expiresIn: '1h' });
      }
      const authenticate = (req, res, next) => {
        const token = req.cookies.token;
       
      
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        jwt.verify(token, process.env.SECRET_KEY_USER, (err, decoded) => {
          if (err) {
            console.error('Token verification failed:', err.message); 
            return res.status(401).json({ message: 'Unauthorized' });
          }
          req.user = decoded;
          next();
        });
      };
    const verifyAdminToken = (req, res, next) => {
        const token = req.cookies.admintoken; 
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        jwt.verify(token, process.env.SECRET_KEY_ADMIN, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.email = decoded.email; 
            next();
        });
    };
    
    app.get('/tokencheck', authenticate, (req, res) => {
        res.status(200).json({ message: 'Token is valid', email: req.email });
    });
    app.post('/admin/logout', (req, res) => {
      res.clearCookie('admintoken'); 
      req.session.destroy(err => {
          if (err) {
              return res.status(500).send('Failed to sign out.');
          }
          res.status(200).send('Signed out successfully.');
      });
  });
    app.get('/admintokencheck', verifyAdminToken, (req, res) => {
      res.status(200).json({ message: 'Token is valid', email: req.email });
  });
      app.post('/adminlogin', (req, res) => {
        const { email, password } = req.body;
      
       
        if (email === process.env.ADMIN_EMAIL && password ===process.env.ADMIN_PASS ) {
      
          const token = generateToken(email);
     
          res.cookie('admintoken', token, { httpOnly: true, secure: true, maxAge: 144000000 }); 
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      });
      app.get('/protectedadmin', verifyAdminToken, (req, res) => {
        res.status(200).json({ message: 'This is a protected route', email: req.email });
      });
    app.get('/protected-route',  authenticate, (req, res) => {
        res.json({ message: 'This is a protected route', user: req.user });
    });
    app.post('/admin/bus',verifyAdminToken, (req, res) => {
        console.log(req.body);
        const { bus_number, bus_name, contactno, capacity } = req.body;
        
        connection.query(
            'INSERT INTO busdetail (bus_number, bus_name, contactno, capacity) VALUES (?, ?, ?, ?)',
            [bus_number, bus_name, contactno, capacity],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error inserting bus data');
                    return;
                }
                console.log('Bus Insert successful:', result);
                res.send('Bus Insert Success');
            }
        );
    });
    app.get('/traveldetail',verifyAdminToken,(req,res)=>{
        connection.query('SELECT t.*,b.bus_number from travel t JOIN busdetail b ON t.bus_id=b.bus_id',(err,result)=>{
            if(err){
                console.error(err);
            }
            else{
                res.status(200).json({result:result})
            }
        })
    })
 
    app.post('/sendemailticket', authenticate, upload.single('file'), async (req, res) => {
        console.log('Received file:', req.file);
        console.log('Request body:', req.body);
      
        
        const { email } = req.body;
        if (!email || !req.file) {
          return res.status(400).send('Email or file not provided');
        }
      
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_SEND,
            pass: process.env.EMAIL_APP_PASS,
          },
        });
      
        const mailOptions = {
          from: process.env.EMAIL_SEND,
          to: email,
          subject: 'Your Bus Ticket',
          text: 'Please find your bus ticket attached.',
          attachments: [{ path: filePath }],
        };
      
        try {
          await transporter.sendMail(mailOptions);
          res.status(200).send('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Failed to send email');
        }
      });


    app.put('/travelupdate',verifyAdminToken, (req, res) => {
        const { travel_id } = req.query;
        const { source, destination, fare, duration, departure, arrival, date_of_travel, bus_number } = req.body;
      
       
        const checkBusQuery = 'SELECT bus_id,capacity FROM busdetail WHERE bus_number = ?';
        connection.query(checkBusQuery, [bus_number], (err, busResult) => {
          if (err) {
            return res.status(500).json({ error: 'Database query error' });
          }
      
          if (busResult.length === 0) {
            return res.status(404).json({ error: 'Bus number not found' });
          }
      
          const bus_id = busResult[0].bus_id;
          const capacity=busResult[0].capacity
      
          const updateTravelQuery = `
            UPDATE travel 
            SET source = ?, destination = ?, departure = ?, arrival = ?, fare = ?, duration = ?, bus_id = ?, date_of_travel = ?,seats_available=?
            WHERE travel_id = ?
          `;
      
          connection.query(updateTravelQuery, [source, destination, departure, arrival, fare, duration, bus_id, date_of_travel, travel_id,capacity], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Database query error' });
            }
      
            if (result.affectedRows > 0) {
              res.status(200).json({ message: 'Travel details updated successfully' });
            } else {
              res.status(404).json({ error: 'Travel record not found' });
            }
          });
        });
      });
      
    


      app.post('/admin/travel',verifyAdminToken, (req, res) => {
        console.log(req.body);
        const { source, destination, fare, duration, departure, arrival, date_of_travel, bus_id } = req.body;
    

        const checkBusQuery = 'SELECT bus_id,capacity FROM busdetail WHERE bus_id = ?';
        connection.query(checkBusQuery, [bus_id], (err, busResult) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database query error');
            }
    
            if (busResult.length === 0) {
                return res.status(404).send("Bus doesn't exist");
            }
          const capacity=busResult[0].capacity;
           
            const insertTravelQuery = `
                INSERT INTO travel (source, destination, fare, duration, departure, arrival, date_of_travel, bus_id,seats_available) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
            `;
            connection.query(insertTravelQuery, [source, destination, fare, duration, departure, arrival, date_of_travel, bus_id,capacity], (err, result) => {
                if (err) {
                    console.error('Error inserting travel data:', err);
                    return res.status(500).send('Error inserting travel data');
                }
                console.log('Travel Insert successful:', result);
                res.send('Travel Insert Success');
            });
        });
    });
    
      
    app.delete('/deletetravel',verifyAdminToken,(req,res)=>{
        const {travel_id}=req.query;
        connection.query('DELETE FROM travel WHERE travel_id=?',[travel_id],(err,result)=>{
            if(err){
                console.error(err);
            }
            res.status(200).json({result:result})
        })   })
        app.post('/signup', async (req, res) => {
            const { email, password } = req.body;
        
            try {
              
                connection.query('SELECT * FROM user WHERE user_email = ?', [email], (err, result) => {
                    if (err) {
                        console.error('Error selecting from database:', err);
                        return res.status(500).json({ error: 'Database selection error: ' + err.message });
                    }
        
                    if (result.length > 0) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
        
                   
                    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            return res.status(500).json({ error: 'Error hashing password: ' + err.message });
                        }
        
                       
                        connection.query('INSERT INTO user (user_email, user_password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                            if (err) {
                                console.error('Error inserting into database:', err);
                                return res.status(500).json({ error: 'Database insertion error: ' + err.message });
                            }
                            return res.status(200).json({ message: 'Successfully registered' });
                        });
                    });
                });
            } catch (e) {
                console.error('Error in signup process:', e);
                res.status(500).json({ error: 'Server error: ' + e.message });
            }
        });
        app.post('/login', (req, res) => {
            const { email, password } = req.body;
          
         
            connection.query('SELECT * FROM user WHERE user_email = ?', [email], (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Database query error: ' + err.message });
              }
          
             
              if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
              }
          
              const user = result[0];
          
             
              bcrypt.compare(password, user.user_password, (err, isMatch) => {
                if (err) {
                  return res.status(500).json({ error: 'Error comparing passwords: ' + err.message });
                }
          
                if (isMatch) {
                  const accessToken = jwt.sign({ email: user.user_email }, process.env.SECRET_KEY_USER, { expiresIn: '40h' });
          
                  res.cookie('token', accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    expires: new Date(Date.now() + 144000000) 
                  });
          
                  return res.status(200).json({ token: accessToken });
                } else {
                  return res.status(401).json({ message: 'Invalid email or password' });
                }
              });
            });
          });
          
          
          app.post('/getsuseremail', authenticate, (req, res) => {
            res.json({ email: req.user.email });
          });
   
    app.post('/create-checkout-session',authenticate, async (req, res) => {
        const { selectedSeats, price } = req.body;
        console.log(selectedSeats, price);
        
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: 'Seat Reservation',
                                description: `Seats: ${selectedSeats.join(', ')}`,
                        
                            },
                            unit_amount: (price * 100)/selectedSeats.length,
                        },
                        quantity: selectedSeats.length,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?seats=${selectedSeats}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
            });

            res.json({ id: session.id });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating checkout session');
        }
    });
   
    app.post('/savepassengerdetails', (req, res) => {
        console.log(req.body);
      
        const { travel_id, passenger, contactDetails, price } = req.body;
        const token = req.cookies.token;
      
        jwt.verify(token, process.env.SECRET_KEY_USER, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
          const { email } = decoded;
      
          let hasError = false;
          let processedCount = 0;
      
          connection.query('SELECT seats_available FROM travel WHERE travel_id = ?', [travel_id], (err, rows) => {
            if (err) {
              console.error('Error fetching seats_available:', err);
              return res.status(500).json({ message: 'Error fetching travel details' });
            }
            const seat = rows[0].seats_available;
      
            const individualPrice = price / passenger.length;
      
            passenger.forEach((value) => {
              const query = 'SELECT * FROM booking WHERE travel_id = ? AND seat_no = ?';
              const values = [travel_id, value.seatnumber];
      
              connection.query(query, values, (err, result) => {
                if (err) {
                  console.error('Error checking passenger details:', err);
                  hasError = true;
                  return;
                }
      
                if (result.length === 0) {
                  const insertQuery = 'INSERT INTO booking(travel_id, seat_no, booking_email, send_email, name, age, gender, phone_no, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  const insertValues = [travel_id, value.seatnumber, email, contactDetails.contactemail, value.name, value.age, value.gender, contactDetails.phone, individualPrice];
      
                  connection.query(insertQuery, insertValues, (err) => {
                    if (err) {
                      console.error('Error inserting passenger details:', err);
                      hasError = true;
                    } else {
                      console.log('Passenger details saved');
                    }
                    processedCount++;
      
                    if (processedCount === passenger.length) {
                      if (hasError) {
                        return res.status(500).json({ message: 'Error saving some passenger details' });
                      } else {
                        connection.query('UPDATE travel SET seats_available = ? WHERE travel_id = ?', [seat - passenger.length, travel_id], (err) => {
                          if (err) {
                            console.error('Error updating seats_available:', err);
                          } else {
                            console.log('Seats available updated');
                          }
      
                          res.status(200).json({ message: 'Passenger details saved successfully' });
                        });
                      }
                    }
                  });
                } else {
                  console.log('Passenger details already exist');
                  processedCount++;
      
                  if (processedCount === passenger.length) {
                    if (hasError) {
                      return res.status(500).json({ message: 'Error saving some passenger details' });
                    } else {
                      res.status(200).json({ message: 'Passenger details saved successfully' });
                    }
                  }
                }
              });
            });
          });
        });
      });
      
      
    
    app.post('/bookingstatus',(req,res)=>{
const {travel_id}=req.body
const query = 'SELECT * FROM booking WHERE travel_id=?';
connection.query(query,[travel_id],(err,result)=>{
    if(err){
        console.log(err);
    }
    else{
        res.status(200).json({result:result});
    }
})
    })
   
    
    app.get('/admin/cities', verifyAdminToken, (req, res) => {
        const query = 'SELECT * FROM cities';
        
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error fetching cities:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ result });
            }
        });
    });
    app.post('/admin/cities', verifyAdminToken, (req, res) => {
        const { city_name } = req.body;
    
        if (!city_name || city_name.trim() === '') {
            return res.status(400).json({ error: 'City name cannot be empty' });
        }
    
        const query = 'INSERT INTO cities (city_name) VALUES (?)';
        
        connection.query(query, [city_name], (err, result) => {
            if (err) {
                console.error('Error adding city:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(201).json({ result: { city_name, id: result.insertId } });
            }
        });
    });
    app.delete('/admin/cities/:id', verifyAdminToken, (req, res) => {
        const { id } = req.params;
    
        const query = 'DELETE FROM cities WHERE city_id = ?';
    
        connection.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error deleting city:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: 'City not found' });
            } else {
                res.status(200).json({ message: 'City deleted successfully' });
            }
        });
    });
    
    
    
    app.get('/alltravel', (req, res) => {
        const { from, to, date } = req.query;
    
    console.log(date)
    


        connection.query(
            'SELECT t.* ,b.bus_name,b.bus_number,b.capacity FROM travel t JOIN busdetail b ON t.bus_id=b.bus_id WHERE t.source=? AND t.destination=? AND t.date_of_travel=?',
            [from, to, date],
            (err, result) => {
                if (err) {
                    console.error('Error fetching travel data:', err);
                    res.status(500).send('Error fetching travel data');
                    return;
                }
                console.log('Travel Fetch successful:', result);
                res.json(result); 
            }
        );
    });
app.get('/admindetail',verifyAdminToken,(req,res)=>{
      connection.query('SELECT COUNT(*) AS bookingcount,SUM(price) as totalrevenue FROM booking',(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).json({result:result});
        }
      })
})
app.post('/getbuscapacity',(req, res) => {
    const { bus_number } = req.body;
    console.log(bus_number)
    if (!bus_number) {
      return res.status(400).json({ error: 'Bus number is required' });
    }
  
    connection.query('SELECT capacity FROM busdetail WHERE bus_number = ?', [bus_number], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Bus not found' });
      }
      res.status(200).json({ capacity: result[0].capacity });
    });
  });
    app.get('/busdetail',verifyAdminToken,(req,res)=>{
        connection.query('SELECT * FROM busdetail',(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).json({result:result});
        }
        })
    })  
    app.get('/cities',(req,res)=>{
        connection.query('select * from cities',(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).json(result);
            }
        })
    })
    app.get('/totalcities',verifyAdminToken,(req,res)=>{
        connection.query('select count(*) as countcity from cities',(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).json({result:result});
            }
        })
    })
app.post('/busadd',verifyAdminToken,(req,res)=>{
    console.log(req.body)
    const{bus_number,bus_name,contactno,capacity}=req.body
    connection.query('INSERT INTO busdetail(bus_number,bus_name,contactno,capacity) VALUES(?,?,?,?)',[bus_number,bus_name,contactno,capacity],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).json({message:'succesfully inserted'})
        }
    })
})
app.put('/busupdate',verifyAdminToken, (req, res) => {
    const { bus_number, bus_name, contactno, capacity } = req.body;
    const sql = 'UPDATE busdetail SET bus_name = ?, contactno = ?, capacity = ? WHERE bus_number = ?';
    
    connection.query(sql, [bus_name, contactno, capacity, bus_number], (err, result) => {
        if (err) {
            console.error('Error updating bus detail:', err);
            res.status(500).send('Error updating bus detail');
            return;
        }
        res.send('Bus detail updated successfully');
    });
});
app.delete('/deletebus',verifyAdminToken,(req,res)=>{
    const{bus_number}=req.query
connection.query('DELETE FROM busdetail WHERE bus_number=?',[bus_number],(err,result)=>{
    if(err){
        console.log(err);}
        else{
            res.status(200).json({message:'succesfully deleted'})
        }
})

})
app.get('/bookings',verifyAdminToken,(req,res)=>{
    const query = 'SELECT b.booking_id, b.seat_no, b.booking_email, b.name, b.age, b.gender, b.phone_no, b.price, t.source, t.destination, t.fare, t.date_of_travel, bd.bus_number, bd.bus_name FROM booking b JOIN travel t ON b.travel_id = t.travel_id JOIN busdetail bd ON t.bus_id = bd.bus_id'
    connection.query(query,(err,result)=>{
      if(err){
          console.log(err);
      }
      else{
          res.status(200).json({result:result});
      }
    })
})
app.post('/getbusid',verifyAdminToken, (req, res) => {
    const { bus_number } = req.body;
  

    if (!bus_number) {
        return res.status(400).json({ error: 'Bus number is required' });
    }

    const query = 'SELECT bus_id FROM busdetail WHERE bus_number = ?';

    connection.query(query, [bus_number], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }

       
        if (results.length > 0) {
            const bus_id = results[0].bus_id; 
            return res.status(200).json({ result: { bus_id } });    
        } else {
            return res.status(404).json({ error: 'Bus not found' });
        }
    });
});


app.get('/totaloperators',verifyAdminToken,(req,res)=>{
    connection.query('SELECT COUNT(*) AS totaloperator FROM busdetail',(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).json({result:result});
        }
})})
    app.post('/getsuseremail',authenticate,(req,res)=>{
        const token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY_USER, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { email } = decoded;
            res.status(200).json({email:email})
        })

    })
    app.post('/gettickets',authenticate,(req,res)=>{
        const token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY_USER, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { email } = decoded;
            
            const query='SELECT * FROM booking b JOIN travel t ON b.travel_id = t.travel_id JOIN busdetail bd ON t.bus_id = bd.bus_id where b.booking_email=?';
           connection.query(query,[email],(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.status(200).json(result);   
            }
           })

        })
    })
    app.post('/verifyemail',authenticate, (req, res) => {
        const email = req.body.email;
        connection.query('SELECT user_email, user_id FROM user WHERE user_email = ?', [email], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                if (results.length === 0) {
                    res.status(200).json({ message: 'Email not registered' });
                } else {
                    res.status(202).json({ message: 'Email registered', user_id: results[0].user_id });
                }
            }
        });
    });
    app.post('/verifyotp',authenticate,(req,res)=>{
  
        const {otp,email}=req.body;
        if (!temporarydata[email]) {
            return res.status(400).json({ message: 'OTP not requested or expired' });
          }
          if (Date.now() > temporarydata[email].expires) {
            delete temporarydata[email];
            return res.status(400).json({ message: 'OTP expired' });
          }
          if (otp === temporarydata[email].otp) {
            delete temporarydata[email]; 
            return res.status(200).json({ message: 'OTP verified successfully' });
          } else {
            return res.status(400).json({ message: 'Invalid OTP' });
          }
    })
    app.post('/sendemail',authenticate, async (req, res) => {
        const { email, otp } = req.body;
        temporarydata[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
      
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host:'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_SEND,
            pass: process.env.EMAIL_APP_PASS,
          },
        });
      
        try {
          const info = await transporter.sendMail({
            from: '"New Bus Pvt. Ltd" <holidaily933@gmail.com>', 
            to: email,      
            subject: 'Your OTP Code for Password Reset', 
            text: `Hello,
      
      We received a request to reset your password. Your OTP code is ${otp}. 
      
      Please use this code to complete your password reset process.
      
      If you did not request this, please ignore this email.
      
      Best regards,
      New Bus Pvt. Ltd.`,
            html: `
              <p>Hello,</p>
              <p>We received a request to reset your password. Your OTP code is <strong>${otp}</strong>.</p>
              <p>Please use this code to complete your password reset process.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,<br />New Bus Pvt. Ltd.</p>
            `,
          });
      
          console.log('Message sent: %s', info.messageId);
          res.status(200).json({ message: 'OTP email sent successfully' });
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Failed to send OTP email' });
        }
      })
    app.post('/passwordchange',authenticate,(req,res)=>{
        const {email,password}=req.body
      
        connection.query('UPDATE user SET user_password=? where user_email=?',[password,email],(err,result)=>{
            if(err) {
                res.status(400).json({message:'cant change password'})
            }
            res.status(200).json({message:'Password changed successfully'});
        })
    })
    app.post('/signout', (req, res) => {
        res.clearCookie('token'); 
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to sign out.');
            }
            res.status(200).send('Signed out successfully.');
        });
    });
    const temporaryData1 = {};
    const checkEmailExists = (email, callback) => {
        connection.query('SELECT user_email FROM user WHERE user_email = ?', [email], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results.length > 0);
        });
    };
    
    app.post('/sendSignupOtp', (req, res) => {
        const { email, otp } = req.body;
    
        checkEmailExists(email, (error, exists) => {
            if (error) {
                return res.status(500).json({ message: 'Database error' });
            }
            if (exists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
    
           
            temporaryData1[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_SEND,
                    pass: process.env.EMAIL_APP_PASS,
                },
            });
    
            transporter.sendMail({
                from: '"New Bus Pvt. Ltd" <holidaily933@gmail.com>',
                to: email,
                subject: 'Your OTP Code for Signup',
                text: `Hello,
    
    We received a request to sign up with this email. Your OTP code is ${otp}.
    
    Please use this code to complete your signup process.
    
    If you did not request this, please ignore this email.
    
    Best regards,
    New Bus Pvt. Ltd.`,
                html: `
                  <p>Hello,</p>
                  <p>We received a request to sign up with this email. Your OTP code is <strong>${otp}</strong>.</p>
                  <p>Please use this code to complete your signup process.</p>
                  <p>If you did not request this, please ignore this email.</p>
                  <p>Best regards,<br />New Bus Pvt. Ltd.</p>
                `,
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Failed to send OTP email' });
                }
                console.log('Message sent: %s', info.messageId);
                res.status(200).json({ message: 'OTP email sent successfully' });
            });
        });
    });
    app.post('/verifySignupOtp', (req, res) => {
        const { email, otp } = req.body;
    
        if (!temporaryData1[email]) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    
        const { otp: storedOtp, expires } = temporaryData1[email];
    
        if (Date.now() > expires) {
            delete temporaryData1[email];
            return res.status(400).json({ message: 'OTP has expired' });
        }
    
        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    
        delete temporaryData1[email];
        res.status(200).json({ message: 'OTP verified successfully' });
    });
    
    app.listen(8000, () => {
        console.log('Server started on port 8000');
    });
