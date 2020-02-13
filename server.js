var express = require("express");
var path = require("path");
var fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//reading the db.json
var db = fs.readFileSync("./db/db.json","utf-8");
db? db = JSON.parse(db):db=[];

//API Routes
app.get("/api/notes", (req, res) => {
  return res.send(db);
});

app.post("/api/notes", (req, res) => {
  var id = !db.length? 0: db[db.length-1].id;
  var body = req.body;
  var idElem = {"id":++id};

  body = {...body, ...idElem};
  db.push(body);
  fs.writeFileSync("./db/db.json", JSON.stringify(db), "utf-8");
  res.json(true);
});

app.delete("/api/notes/:id", (req,res) => {
  var selected = parseInt(req.params.id);

  for (var i = 0; i < db.length; i++) {
    if (selected === db[i].id) {
      db.splice(i,1);
      fs.writeFileSync("./db/db.json", JSON.stringify(db), "utf-8");
      return res.json(true);
    }
  }
  return res.json(false);
});


//HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Listening to Server
app.listen(PORT, () =>{
  console.log("App listening on PORT: http://localhost:" + PORT);
});
