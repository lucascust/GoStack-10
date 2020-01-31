const express = require('express')

// Criando API com express
const server = express();

// Express passa a ler JSON
server.use(express.json());

server.listen(3000)

var projectsArray = [];

// Middlewares globais

function verifyProjectId (req, res, next){
  const { id } = req.params
  if (!projectsArray[id]){
    return res.json({"error": "Project do not exist."})
  }

  next();
}


// ROTAS /////

// POST
server.post("/projects", (req, res) =>{
  projectsArray.push(req.body);

  return res.json(projectsArray);

});

// GET
server.get("/projects", (req, res) => {
  return res.json(projectsArray);
}); 
// GET one project
server.get("/projects/:id", verifyProjectId, (req, res) => {
  const { id } = req.params;

  
  console.log(projectsArray);

  return res.json(projectsArray[id]);
});

// PUT
server.put("/projects/:id", verifyProjectId, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  projectsArray[id].title = title;
  
  return res.json(projectsArray);
});

// Delete
server.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  projectsArray.splice(id, 1);

  return res.json(projectsArray);
});