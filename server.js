const express = require('express') //importing express
const app = express() //set variable to access express
const MongoClient = require('mongodb').MongoClient //importing mongodb and connecting to client
const PORT = 2121 //setting up port number
require('dotenv').config() //importing config file to use so to not upload any api keys


let db, //establish variables & db name
    dbConnectionStr = process.env.DB_STRING, //bring in connection string from config file
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to data based, useunified = find server
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //if successful, log DB name
        db = client.db(dbName) //simplify the db actions
    })
    
app.set('view engine', 'ejs') // set express to use embedded js and declaring it as the dynamic html
app.use(express.static('public')) // allow express to access static content in public folder, middleware function
app.use(express.urlencoded({ extended: true })) // setting up json, middleware function
app.use(express.json()) //allow express to use json, middleware function


app.get('/',async (request, response)=>{ //get data, pull data from mongodb
    const todoItems = await db.collection('todos').find().toArray() // go to mongodb and turn the todos into an array and await until the response is filled
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count the documents that have false in the object to return the items left to do
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the ejs template with an object of items with todoItems within and the same for left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //use the endpoint of addTodo to receive requests from html form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert the object into mongodb
    .then(result => { //if success, consolelog added and redirect to home page
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { //listen for markcomplete request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //if recevied, find the item from client side JS
        $set: {
            completed: true //set task as completed
          }
    },{
        sort: {_id: -1}, // sort
        upsert: false //do not add a new row if not found
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //listen to an uncomplete request to update the item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the item
        $set: {
            completed: false //mark as false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //listen for a delete request from client
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find the item and delete it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //set the port for express to listen and it is either the heroku/mongodb port or the one set at the top
    console.log(`Server running on port ${PORT}`)
})
