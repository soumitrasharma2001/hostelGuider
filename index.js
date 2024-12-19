const express=require('express')
const app=express()
const path=require('path')
const bodyParser = require('body-parser');
const db=require('./connection')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.get("/",(_,res)=>{
    res.render("index");
})
app.post("/postRequirements",(req,res)=>{
    const collegeCoordinate = {
        lat: parseFloat(req.body.location.split(',')[0]), 
        lon: parseFloat(req.body.location.split(',')[1]) // Corrected 'log' to 'lon'
    };
    const sql=`SELECT *,
    (6371 * acos(
        cos(radians(${collegeCoordinate.lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${collegeCoordinate.lon})) +
        sin(radians(${collegeCoordinate.lat})) * sin(radians(latitude))
    )) AS distance
    FROM hostels
    HAVING distance <= ${req.body.range} 
    AND monthly_rent <= ${req.body.budget} 
    AND gender = ${req.body.gender};` 
    db.query(sql,(err,results)=>{
        if(err){
            console.log(err)
            res.render('index')
        }
        else{
            res.render('responses',{results:results})
        }
    })
})
app.get("/upload",(req,res)=>{
    res.render("upload", { statusCode: 20 });
})
app.post("/upload",(req,res)=>{
    
    const data=[
        req.body.name,
        +req.body.location.split(',')[0],
        +req.body.location.split(',')[1],
        +req.body.contact,
        req.body.address,
        +req.body.budget,
        +req.body.gender,
        (typeof req.body.wifi==="undefined")?0:1,
        (typeof req.body.gym==="undefined")?0:1,
        (typeof req.body.mess==="undefined")?0:1,
        (typeof req.body.laundry==="undefined")?0:1
    ]
    db.query(`INSERT INTO Hostels (name, latitude, longitude, contact_number, address,monthly_rent, gender, wifi, gym, mess, laundry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,data,(err)=>{
        if(err) res.status(500).render("upload", { statusCode: 500, message: 'Database error occurred.' });
        else  res.status(200).render("upload", { statusCode: 200, message: 'Hostel details uploaded successfully!' });
    })  
})
app.listen(4500)