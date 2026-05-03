const express = require('express');
const sequelize = require('./config/database'); 
const User = require('./models/User');          
const Post = require('./models/Post');          

const app = express();
app.use(express.json());


User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });


sequelize.sync({ force: false })
  .then(() => {
    console.log("З'єднання з MySQL встановлено, таблиці синхронізовано.");
    

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Сервер працює на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Помилка підключення до бази даних:", err);
  });

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ include: Post });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});