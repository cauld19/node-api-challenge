const express = require('express');

const router = express.Router();

const Action = require('../data/helpers/actionModel');

router.get('/', (req, res) => {
    Action.get()
          .then(posts => {
              res.status(200).json(posts);
          })
          .catch(err => {
              res.status(500).json({ error: "The information could not be retrieved." });
          })
  });

router.get('/:id', validateActionId, (req, res) => {
    Action.get(req.params.id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({error: "The action information could not be retrieved"});
        })
});

router.post('/', validateAction, (req, res) => {
    const actionInfo = req.body

    Action.insert(actionInfo)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the action to the database" });
      })
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
    const actionInfo = req.body

    Action.update(req.params.id, actionInfo)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({error: "The information could not be modified"});
        })  
});

router.delete('/:id', validateActionId, (req, res) => {

    Action.remove(req.params.id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({error: "The action could not be removed"})
        })
})




/**************************************************************** Custom Middleware */

function validateActionId(req, res, next) {
    const {id} = req.params;
    Action.get(id)
        .then(action => {
        if(action) {
            req.action = action;
            next();
        } else {
            res.status(400).json({ message: "invalid action id" });
        }   
        })
        .catch(err => {
            res.status(500).json({message: 'exception error'});
        })
}

function validateAction(req, res, next) {
    const actionData = req.body;
    if(!actionData) {
      res.status(400).json({ message: "missing action data" });
    } else if (!actionData.description) {
      res.status(400).json({ message: 'missing required description field'})
    } else if (!actionData.notes) {
        res.status(400).json({ message: 'missing required notes field'})
    } else {
      next();
    }
  }




module.exports = router;