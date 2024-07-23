    const express = require('express');
    const app = express();
    const connection = require('./connection'); 
    const multer = require('multer');
    const cors = require('cors');
    const moment = require('moment');
    const upload = multer({ storage: multer.memoryStorage() });
    const nodemailer = require("nodemailer");
    const bodyParser = require('body-parser');
    const session = require('express-session');
    const stripe = require('stripe')('sk_test_51Pdc9DH8027hl3xprnBWhHLydYMFz29tB1GVqqN4LOxYNsgl5cVMoJrM4zgLePhTO0SpoFaaUx69mpVpCTcgtzmp00XhMZf2ff', {
        apiVersion: '2020-08-27',
    });
    const jwt=require('jsonwebtoken')
    const cookieParser = require('cookie-parser');
let temporarydata={};


    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'rams', 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    function generateToken(email) {
        return jwt.sign({ email }, 'adminlogin', { expiresIn: '1h' });
      }
    const authenticate = (req, res, next) => {
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        jwt.verify(token, 'rams', (err, decoded) => {
            if (err) {
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
    
        jwt.verify(token, 'adminlogin', (err, decoded) => {
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
      app.post('/adminlogin', (req, res) => {
        const { email, password } = req.body;
      
       
        if (email === 'sushantdahal733@gmail.com' && password === '12345') {
      
          const token = generateToken(email);
     
          res.cookie('admintoken', token, { httpOnly: true, secure: true, maxAge: 36000000 }); 
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
    app.put('/travelupdate',verifyAdminToken, (req, res) => {
        const { travel_id } = req.query;
        const { source, destination, fare, duration, departure, arrival, date_of_travel, bus_number } = req.body;
      
        // First, check if the bus number exists in the busdetail table
        const checkBusQuery = 'SELECT bus_id FROM busdetail WHERE bus_number = ?';
        connection.query(checkBusQuery, [bus_number], (err, busResult) => {
          if (err) {
            return res.status(500).json({ error: 'Database query error' });
          }
      
          if (busResult.length === 0) {
            return res.status(404).json({ error: 'Bus number not found' });
          }
      
          const bus_id = busResult[0].bus_id;
      
          const updateTravelQuery = `
            UPDATE travel 
            SET source = ?, destination = ?, departure = ?, arrival = ?, fare = ?, duration = ?, bus_id = ?, date_of_travel = ?
            WHERE travel_id = ?
          `;
      
          connection.query(updateTravelQuery, [source, destination, departure, arrival, fare, duration, bus_id, date_of_travel, travel_id], (err, result) => {
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
    

        const checkBusQuery = 'SELECT bus_id FROM busdetail WHERE bus_id = ?';
        connection.query(checkBusQuery, [bus_id], (err, busResult) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database query error');
            }
    
            if (busResult.length === 0) {
                return res.status(404).send("Bus doesn't exist");
            }
    
           
            const insertTravelQuery = `
                INSERT INTO travel (source, destination, fare, duration, departure, arrival, date_of_travel, bus_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(insertTravelQuery, [source, destination, fare, duration, departure, arrival, date_of_travel, bus_id], (err, result) => {
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
    app.post('/signup', (req, res) => {
        const { email, password } = req.body;
    
        connection.query('SELECT * FROM user WHERE user_email = ?', [email], (err, result) => {
            if (err) {
                console.error('Error selecting from database:', err);
                return res.status(500).json({ error: 'Database selection error: ' + err.message });
            }
    
            if (result.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }
    
            connection.query('INSERT INTO user (user_email, user_password) VALUES (?, ?)', [email, password], (err, result) => {
                if (err) {
                    console.error('Error inserting into database:', err);
                    return res.status(500).json({ error: 'Database insertion error: ' + err.message });
                }
                return res.status(200).json({ message: 'Successfully registered' });
            });
        });
    }); 
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
        const user={email:email}
        
        connection.query('SELECT * FROM user WHERE user_email = ? AND user_password = ?', [email, password], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.length > 0) {
                const accesstoken=jwt.sign(user,'rams')
                console.log(accesstoken)
                res.cookie('token', accesstoken, {
                    httpOnly: true,
                    secure: false, 
                    sameSite: 'lax',
                    expires: new Date(Date.now() + 3600000) 
                });
                return res.status(200).json({ token:accesstoken});
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        });
    });

    ///stripe
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
                success_url: `http://localhost:3000/payment/success?seats=${selectedSeats}`,
                cancel_url: 'http://localhost:3000/payment/failed',
            });

            res.json({ id: session.id });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating checkout session');
        }
    });
   
    app.post('/savepassengerdetails', (req, res) => {
        console.log(req.body); // Log the request body to debug
    
        const { travel_id, passenger, contactDetails,price } = req.body;
        const token = req.cookies.token;
    
        jwt.verify(token, 'rams', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { email } = decoded;
    
            let hasError = false;
            let processedCount = 0;
    
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
                        const insertQuery = 'INSERT INTO booking(travel_id, seat_no, booking_email, send_email, name, age, gender, phone_no,price) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
                        const insertValues = [travel_id, value.seatnumber, email, contactDetails.contactemail, value.name, value.age, value.gender, contactDetails.phone,price];
    
                        connection.query(insertQuery, insertValues, (err, insertResult) => {
                            if (err) {
                                console.error('Error inserting passenger details:', err);
                                hasError = true;
                                return;
                            }
                            console.log('Passenger details saved:', insertResult);
                            processedCount++;
    
                            if (processedCount === passenger.length) {
                                if (hasError) {
                                    res.status(500).json({ message: 'Error saving some passenger details' });
                                } else {
                                    res.status(200).json({ message: 'Passenger details saved successfully' });
                                }
                            }
                        });
                    } else {
                        console.log('Passenger details already exist:', result);
                        processedCount++;
    
                        if (processedCount === passenger.length) {
                            if (hasError) {
                                res.status(500).json({ message: 'Error saving some passenger details' });
                            } else {
                                res.status(200).json({ message: 'Passenger details saved successfully' });
                            }
                        }
                    }
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

    
    
    app.get('/alltravel', (req, res) => {
        const { from, to, date } = req.query;
    
    console.log(date)
    


        connection.query(
            'SELECT t.* ,b.bus_name,b.bus_number FROM travel t JOIN busdetail b ON t.bus_id=b.bus_id WHERE t.source=? AND t.destination=? AND t.date_of_travel=?',
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
app.get('/admindetail',(req,res)=>{
      connection.query('SELECT COUNT(*) AS bookingcount,SUM(price) as totalrevenue FROM booking',(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.status(200).json({result:result});
        }
      })
})
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
    const query = 'SELECT b.booking_id,b.bus_number, b.seat_no, b.booking_email, b.name, b.age, b.gender, b.phone_no, b.price, t.source, t.destination, t.fare, t.date_of_travel, bd.bus_number, bd.bus_name FROM booking b JOIN travel t ON b.travel_id = t.travel_id JOIN busdetail bd ON t.id = bd.bus_id'
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
    console.log(req.body);

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
        jwt.verify(token, 'rams', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { email } = decoded;
            res.status(200).json({email:email})
        })

    })
    app.post('/gettickets',authenticate,(req,res)=>{
        const token = req.cookies.token;
        jwt.verify(token, 'rams', (err, decoded) => {
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
    app.post('/verifyemail', (req, res) => {
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
    app.post('/verifyotp',(req,res)=>{
  
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
    app.post('/sendemail', async (req, res) => {
        const { email, otp } = req.body;
        temporarydata[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
      
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host:'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'holidaily933@gmail.com',
            pass: 'wgpc klqg sfwc dlod',
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
    app.post('/passwordchange',(req,res)=>{
        const {email,password}=req.body
        connection.query('UPDATE user SET user_password=? where user_email=?',[password,email],(err,result)=>{
            if(err) {
                res.status(400).send('cant change password')
            }
            res.status(200).send('Password changed successfully');
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
    
 
    app.listen(8000, () => {
        console.log('Server started on port 8000');
    });
