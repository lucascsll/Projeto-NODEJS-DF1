const express = require("express");

const server = express();
server.use(express.json());

let numberOfRequests = 0;
const projects = [];

//Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "project not found" });
  }
  return next();
}

function LogRequests(req, res, next) {
  numberOfRequests++;
  console.log(`O numero de requisições : ${numberOfRequests}`);

  return next();
}
server.use(LogRequests);

//List of users
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Create Users
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    task: []
  };
  projects.push(project);

  return res.json(projects);
});

//alter users

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
});

//Delete User
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projetcIndex = projects.findIndex(p => p.id == id);

  projects.splice(projetcIndex, 1);
  return res.send("Deletado");
});

//Create Task
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(p => p.id == id);

  project.task.push(task);
  return res.json(project);
});

server.listen(3000);
