const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("dotenv").config();

const initializePassport = require("./passportConfig");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());

pool.connect((err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
  } else {
    console.log("Connected to database");
  }
});

app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, type } = req.body;
  if (!first_name || !last_name || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (err, result) => {
        if (err) res.status(400).json({ error: err });

        if (result.rows.length > 0) {
          res.status(400).json({ error: "Email is already registered" });
        } else {
          pool.query(
            "INSERT INTO users (first_name, last_name, email, password, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, password",
            [first_name, last_name, email, hashedPassword, type],
            (err, result) => {
              if (err) res.status(400).json({ error: err });
              else {
                res.status(200).json({
                  message: "User registration successful" + result.rows,
                });
              }
            }
          );
        }
      }
    );
  }
});

app.post("/users/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res
        .status(200)
        .json({ message: "Login successful", user: { ...user } });
    });
  })(req, res, next);
});

app.put("/user/update", (req, res) => {
  const { email, first_name, last_name, phone, address, postcode, state } =
    req.body;

  const updateQuery =
    "UPDATE users SET first_name = $2, last_name = $3, phone = $4, address = $5, postcode = $6, state = $7 WHERE email = $1";
  pool.query(
    updateQuery,
    [email, first_name, last_name, phone, address, postcode, state],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: `Error updating user: ${err}` });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ message: "User updated", user: req.body });
      }
    }
  );
});

//jobs accepted by maker
app.post("/maker/jobs/retrive", (req, res) => {
  const accepted_maker = req.body.accepted_maker;
  pool.query(
    "SELECT * FROM jobs WHERE accepted_maker = $1 AND status != 'open'",
    [accepted_maker],
    (err, result) => {
      if (err)
        return res.status(400).json({ error: `Error retriving jobs: ${err}` });

      return res.status(200).json({
        message: `Jobs retrived: ${result.rows.length}`,
        jobsData: result.rows,
      });
    }
  );
});

//Get job from id
app.post("/job/retrive", (req, res) => {
  const id = req.body.id;
  pool.query("SELECT * FROM jobs WHERE id = $1", [id], (err, result) => {
    if (err)
      return res.status(400).json({ error: `Error retriving jobs: ${err}` });

    return res.status(200).json({
      message: `Jobs retrived: ${result.rows.length}`,
      jobData: result.rows[0],
    });
  });
});

//open jobs for maker
app.post("/maker/open-jobs/retrive", (req, res) => {
  const status = req.body.status;
  pool.query(
    "SELECT * FROM jobs WHERE status = $1",
    [status],
    (err, result) => {
      if (err)
        return res.status(400).json({ error: `Error retriving jobs: ${err}` });

      return res.status(200).json({
        message: `Jobs retrived: ${result.rows.length}`,
        jobsData: result.rows,
      });
    }
  );
});

app.post("/consumer/jobs/retrive", (req, res) => {
  const consumer_id = req.body.consumer_id;
  pool.query(
    "SELECT * FROM jobs WHERE consumer_id = $1",
    [consumer_id],
    (err, result) => {
      if (err)
        return res.status(400).json({ error: `Error retriving jobs: ${err}` });

      return res.status(200).json({
        message: `Jobs retrived: ${result.rows.length}`,
        jobsData: result.rows,
      });
    }
  );
});

app.post("/jobs/add", (req, res) => {
  const {
    consumer_id,
    first_name,
    last_name,
    phone,
    email,
    address,
    state,
    postcode,
    clothing_type,
    images,
    title,
    description,
    budget,
    status,
    gender,
    req_makers,
    accepted_maker,
  } = req.body;

  if (
    !consumer_id ||
    !first_name ||
    !email ||
    !phone ||
    !address ||
    !state ||
    !title
  ) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    console.log({
      consumer_id,
      first_name,
      last_name,
      phone,
      email,
      address,
      state,
      postcode,
      clothing_type,
      images,
      title,
      description,
      budget,
      status,
      gender,
      req_makers,
      accepted_maker,
    });
    const insertQuery =
      "INSERT INTO jobs (consumer_id,first_name,last_name,phone,email,address,state,postcode,clothing_type,images,title,description,budget,status,gender,req_makers,accepted_maker) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id";
    pool.query(
      insertQuery,
      [
        consumer_id,
        first_name,
        last_name,
        phone,
        email,
        address,
        state,
        postcode,
        clothing_type,
        images,
        title,
        description,
        budget,
        status,
        gender,
        req_makers,
        accepted_maker,
      ],
      (err, result) => {
        if (err) res.status(400).json({ error: err });
        else {
          res.status(200).json({
            message: "Job adding successful" + result.rows,
          });
        }
      }
    );
  }
});

app.put("/jobs/:id/update-req-makers", (req, res) => {
  const jobId = req.params.id;
  const { req_makers } = req.body;
  console.log(jobId, req_makers);
  if (!req_makers) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    const updateQuery = "UPDATE jobs SET req_makers = $1 WHERE id = $2";
    pool.query(updateQuery, [req_makers, jobId], (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Job not found" });
      } else {
        res.status(200).json({
          message: `Updated job with id ${jobId}`,
        });
      }
    });
  }
});

app.put("/jobs/:id/update-req-status", (req, res) => {
  const jobId = req.params.id;
  const maker_id = req.body.maker_id;
  if (maker_id == undefined) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    const updateQuery =
      "UPDATE jobs SET status = 'Inprogress', accepted_maker = $1, req_makers = '{}' WHERE id = $2";
    pool.query(updateQuery, [maker_id, jobId], (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: "Job not found or already taken" });
      } else {
        res.status(200).json({
          message: `Updated job with id ${jobId}`,
        });
      }
    });
  }
});

app.put("/jobs/:id/completed", (req, res) => {
  const id = req.params.id;

  pool.query(
    "UPDATE jobs SET status = $1 WHERE id = $2",
    ["completed", id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res
          .status(200)
          .json({ message: `Job with id ${id} has been marked as completed.` });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
