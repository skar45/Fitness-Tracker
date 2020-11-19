const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const user = require("./models.js");
const path = require("path");
const app = express();

const router = express.Router();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
app.set('view engine', 'ejs');
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Workout", { useNewUrlParser: true });

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});


router.get('/api/workouts', function(req,res){
  user.find()
    .then(workout=>{
      res.json(workout)
    })
    .catch(err =>{
      res.json(err)
    })
})

router.post('/api/workouts', function(req,res){ 
  console.log(req.body)
  user.create({}).then(workout=>res.json(workout))
})

router.put("/api/workouts/:id", ({ body, params }, res) => {
  user.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    { new: true, runValidators: true }
  )
    .then(workout => {
      res.json(workout);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/api/workouts/range", ({ query }, res) => {
  user.find({ day: { $gte: query.start, $lte: query.end } })
    .then(workout => {
      res.json(workout);
    })
    .catch(err => {
      res.json(err);
    });
});



router.delete("/api/workouts", ({ body }, res) => {
  user.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/exercise", (req, res) => {
  console.log("get /execise")
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});
