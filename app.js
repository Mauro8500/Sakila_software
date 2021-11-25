const express = require('express')
const app = express()
const morgan = require('morgan');
const mongoose = require('mongoose');
var mysql = require('mysql2');


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));



app.use(morgan('tiny'))


// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'sakila'
});

// connect to database
dbConn.connect();


app.get("/", (req,res)=>{
    res.send('Sakila Api')
})


//store end-points

app.get("/store", (req,res)=>{
    const queryString='SELECT * FROM sakila.store'

    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
})

app.get("/store/:store_id", (req,res)=>{
    const queryString=`SELECT * FROM sakila.store WHERE store_id=${req.params.store_id}`


    if(req.params.store_id<1 && isNaN(req.params.store_id)){
        res.status(400).json({message:"Invalid id supplied"})
    }
    dbConn.query(queryString, function(error, results, fields) {
        if (error || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
    
})

//customer end-points


const Customer = function(customer) {
    this.first_name=customer.first_name;
    this.last_name=customer.last_name;
    this.email=customer.email;
    this.address=customer.address;
    this.district=customer.district;
    this.city_id=customer.city_id;
    this.postal_code=customer.postal_code;

  };

app.post("/customer", (req,res)=>{
    // const {address, address2, district, city_id, postal_code, phone} = req.body;
    // const addressQuery=`INSERT INTO sakila.address (address, address2, district, city_id, postal_code, phone, location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    // var points = [
    //     [{ lat: 1, long: 4}],
    //     [{ lat: 23, long: -8.345}]
    // ];

    // dbConn.query(addressQuery, [address,address2,district,city_id,postal_code, phone,points] , (error, results) => {
    //     if (error  || results.length<1){
    //         res.status(404).json({message:error})
    //     }
        
    //     else {
            
    //     } 
                
          
    //   });
    const {first_name, last_name, email, address_id } = req.body;


      const queryString=`INSERT INTO sakila.customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?, ?,?)`;
            
            dbConn.query(queryString, [1,first_name,last_name,email,address_id] , (error, results) => {
                if (error  || results.length<1){
                    res.status(404).json({message:error})
                }
                else {
                    return res.status(200).json({ message: "Succesful operation", data: results });
                } 
                
          
      });

    
     
       
})

app.get("/customer", (req,res)=>{
    const queryString='SELECT * FROM sakila.customer'

    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
    
})



app.get("/customer/:customer_id", (req,res)=>{

    const queryString=`SELECT * FROM sakila.customer WHERE customer_id=${req.params.customer_id}`


    if(req.params.customer_id<1 && isNaN(req.params.customer_id)){
        res.status(400).json({message:"Invalid id supplied"})
    }
    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
})

app.put("/customer/:customer_id", (req,res)=>{
    const {first_name, last_name, email, address_id } = req.body;


    const queryString=`UPDATE sakila.customer SET first_name = ?, last_name = ?,  email = ?,  address_id = ? WHERE customer_id = ${req.params.customer_id}`;
          dbConn.query(queryString, [first_name,last_name,email,address_id] , (error, results) => {
              if (error  || results.length<1){
                  res.status(404).json({message:error})
              }
              else {
                  return res.status(200).json({ message: "Succesful operation", data: results });
              } 
              
        
    });
    
})

app.delete("/customer/(:customer_id)", (req,res)=>{

    let queryString=`SELECT * FROM sakila.customer WHERE customer_id=${req.params.customer_id}`


    if(req.params.customer_id<1 && isNaN(req.params.customer_id)){
        res.status(400).json({message:"Invalid id supplied"})
    }
    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"Customer not found"})
        }
    });

    queryString=`DELETE FROM sakila.payment WHERE customer_id=${req.params.customer_id}`


    dbConn.query(queryString, function(error, results, fields) {
        
    });

    queryString=`DELETE FROM sakila.rental WHERE customer_id=${req.params.customer_id}`


    dbConn.query(queryString, function(error, results, fields) {
        
    });

    queryString=`DELETE FROM sakila.customer WHERE customer_id=${req.params.customer_id}`
    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed", error:error})
        }
        else {
            return res.status(200).json({message: "Succesful operation"});

        } 
    });

    
})

//film end-points

// app.get("/film?title", (req,res)=>{
//     const queryString='SELECT * FROM sakila.film'

    
// })

app.get("/film", (req,res)=>{

    


    const queryString='SELECT * FROM sakila.film'

        if(req.query.length<1){
            dbConn.query(queryString, function(error, results, fields) {
                if (error  || results.length<1){
                    res.status(404).json({message:"operation failed"})
                }
                else {
                    return res.status(200).json({ message: "Succesful operation", data: results });
                } 
            });
        }else{

            const filters = req.query;

            if(req.query.actor){
                dbConn.query('SELECT * FROM sakila.actor', function(error, results, fields) {
                    if (error  || results.length<1){
                        res.status(404).json({message:"operation failed"})
                    }
                    else {
                        const filteredData = results.filter(actor=>{
                            let isValid = true;
                            isValid = isValid && (actor.first_name.toLowerCase().includes(req.query.actor) ||actor.last_name.toLowerCase().includes(req.query.actor) )
                            return isValid
                        })
                        
                        dbConn.query('SELECT * FROM sakila.film_actor', function(error, results, fields) {
                            if (error  || results.length<1){
                                res.status(404).json({message:"operation failed"})
                            }
                            else {
                                const filteredFilmActor = results.filter(actor=>{
                                    let isValid = true;
                                    for(let data in filteredData){
                                        //console.log(data.actor_id);

                                        isValid = isValid && actor.actor_id == data.actor_id

                                    }
                                    return isValid;
                                })
                                res.send(filteredData)
                            
                            } 
                        });
                        

                    } 
                });
            }else{
                dbConn.query(queryString, function(error, results, fields) {
                    if (error  || results.length<1){
                        res.status(404).json({message:"operation failed"})
                    }
                    else {
            
                        const filteredData = results.filter(film=>{
                            film.title= film.title.toLowerCase()
                            let isValid = true;
                            for (key in filters) {
                              console.log(key, film[key], filters[key]);
                              if(key == "title"){
                                isValid = isValid && film[key].includes(filters[key]);
                              }else{
                                isValid = isValid && film[key] ===filters[key];
    
                              }
                            }
                            film.title= film.title.toUpperCase()
                            return isValid;
                        })
                        res.send(filteredData);           
                     } 
                });
            }

           
        }
       
   
})



// app.get("/film?actor", (req,res)=>{
//     const queryString='SELECT * FROM sakila.actor'

//     dbConn.query(queryString, function(error, results, fields) {
//         if (error  || results.length<1){
//             res.status(404).json({message:"operation failed"})
//         }
//         else {
//             const filters = req.query;

//             const filteredData = results.filter(film=>{
//                 film.title= film.title.toLowerCase()
//                 let isValid = true;
//                 for (key in filters) {
//                   console.log(key, film[key], filters[key]);
//                   isValid = isValid && film[key] == filters[key];
//                 }
//                 film.title= film.title.toUpperCase()
//                 return isValid;
//             })
//             res.send(filteredData);           
//          } 
//     });

 
// })


//inventory end-points

app.get("/inventory", (req,res)=>{
    const queryString='SELECT * FROM sakila.inventory'

    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
    
})

//payment end-points

app.post("/payment/:customer_id", (req,res)=>{

    const {rental_id, amount} = req.body;
    let payment= new Date(req.body.payment_date)
    

    const queryString=`INSERT INTO sakila.payment (customer_id,staff_id,rental_id, amount, payment_date) VALUES (?,?, ?, ?, ?)`;

    dbConn.query(queryString, [req.params.customer_id,1,rental_id,amount, payment] , (error, results) => {
        if (error  || results.length<1){
            res.status(404).json({message:error})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
                
          
      });
     
       
    
})

app.get("/payment/:customer_id", (req,res)=>{
    const queryString=`SELECT * FROM sakila.payment WHERE customer_id=${req.params.customer_id}`


    if(req.params.customer_id<1 && isNaN(req.params.customer_id)){
        res.status(400).json({message:"Invalid id supplied"})
    }
    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
    
})


//rental end-points

app.post("/rental/:customer_id", (req,res)=>{

    const {rental_date, inventory_id, return_date} = req.body;
    let rental = new Date(req.body.payment_date);
    let returnd = new Date(req.body.return_date);

    

    const queryString=`INSERT INTO sakila.rental (rental_date, inventory_id, customer_id, return_date, staff_id) VALUES (?,?, ?, ?, ?)`;

    dbConn.query(queryString, [rental,inventory_id,req.params.customer_id,returnd,1] , (error, results) => {
        if (error  || results.length<1){
            res.status(404).json({message:error})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
                
          
      });
     
})

app.get("/rental/:customer_id", (req,res)=>{
    const queryString=`SELECT * FROM sakila.rental WHERE customer_id=${req.params.customer_id}`


    if(req.params.customer_id<1 && isNaN(req.params.customer_id)){
        res.status(400).json({message:"Invalid id supplied"})
    }
    dbConn.query(queryString, function(error, results, fields) {
        if (error  || results.length<1){
            res.status(404).json({message:"operation failed"})
        }
        else {
            return res.status(200).json({ message: "Succesful operation", data: results });
        } 
    });
    
})




app.listen(3000, ()=>{
    console.log("Server is Running on port 3000");
})

