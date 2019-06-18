const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json())
server.use(cors())

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (name && bio) {
    db.insert(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the user to the database" })
      })
  } else {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }

});

server.get('/api/users', (req, res) => {
  db.find()
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({ error: "The users information could not be retrieved." })
  })
})

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params

  db.findById(id)
  .then(user => {
    if(user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be retrieved." })
  })
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params

  db.remove(id)
  .then(deleted => {
    if(deleted) {
      res.status(204).end()
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user could not be removed" })
  })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body
  const user = req.body

  if(name && bio) {
    db.update(id, user)
      .then(updated => {
        if(updated) {
            res.status(200).json(user)
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The user information could not be modified." })
      })
  } else {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }

})

server.listen(5000, ()=>console.log("App is Running"))
