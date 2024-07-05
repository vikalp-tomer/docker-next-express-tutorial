const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisam = new PrismaClient();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// test api
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "api working" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all the users
app.get("/users", async (req, res) => {
  try {
    const users = await prisam.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get user by id
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisam.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//create new user with name and email
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisam.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update user
app.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  try {
    const user = await prisam.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete user
app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisam.user.delete({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
