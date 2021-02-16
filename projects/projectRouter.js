const express = require('express');

const router = express.Router();

const Project = require('../data/helpers/projectModel');

router.get('/', (req, res) => {
    Project.get()
          .then(posts => {
              res.status(200).json(posts);
          })
          .catch(err => {
              res.status(500).json({ error: "The information could not be retrieved." });
          })
});

router.get('/:id', validateProjectId, (req, res) => {
    Project.get(req.params.id)
        .then(project => {
                res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({error: "The project information could not be retrieved"});
        })
});

router.post('/', validateProject, (req, res) => {
    const projectInfo = req.body;
    console.log(projectInfo);

    Project.insert(projectInfo)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the action to the database" });
      })
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const projectInfo = req.body

    Project.update(req.params.id, projectInfo)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({error: "The information could not be modified"});
        })  
});

router.delete('/:id', validateProjectId, (req, res) => {

    Project.remove(req.params.id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({error: "The project could not be removed"});
        })
});

router.get('/:id/action', validateProjectId, (req, res) => {

    Project.getProjectActions(req.params.id)
        .then(project => {
            if (project.length < 1 ) {
                res.status(400).json({message: "There are no actions associated with this project"});
            } else if (project) {
                res.status(200).json(project);
            } else {
                res.status(400).json({message: "The project with the specified ID does not exist"});
            }
        })
        .catch(err => {
            res.status(500).json({error: "The project information could not be retrieved"});
        })
})



  /**************************************************************** Custom Middleware */

function validateProjectId(req, res, next) {
    const {id} = req.params;
    Project.get(id)
        .then(project => {
        if(project) {
            req.project = project;
            next();
        } else {
            res.status(400).json({ message: "invalid project id" });
        }   
        })
        .catch(err => {
            res.status(500).json({message: 'exception error'});
        })
}

function validateProject(req, res, next) {
    const projectData = req.body;
    if(!projectData) {
      res.status(400).json({ message: "missing project data" });
    } else if (!projectData.name) {
      res.status(400).json({ message: 'missing required name field'})
    } else if (!projectData.description) {
        res.status(400).json({ message: 'missing required description field'})
    } else {
      next();
    }
}

module.exports = router;