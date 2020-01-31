const express = require('express')

// Criando API com express
const server = express();

// Express passa a ler JSON
server.use(express.json());

server.listen(3000)

var projectsArray = [];

// Middlewares globais

// Verifica se projeto solicitado pelo ID existe
function verifyProjectId (req, res, next){
  const { id } = req.params

  if (!projectsArray[id]){
    return res.status(400).json({"error": "Project do not exist."})
  }

  next();
}


// ROTAS /////

// POST
server.post("/projects", (req, res) =>{
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projectsArray.push(project);

  return res.json(project);

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

  return res.send();
});