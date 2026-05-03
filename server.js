const express = require("express");
const app = express();

// Middleware для парсингу JSON
app.use(express.json());

// Масив для зберігання даних у пам'яті (замість БД для лабораторної)
let students = [
    { id: 1, name: "Гром Богдан", group: "ІО-31" }
];

// Завдання 2: Базовий маршрут
app.get("/", (req, res) => {
    res.send("Hello from Node.js server");
});

// Завдання 3: Отримання списку студентів
app.get("/students", (req, res) => {
    res.json(students);
});

// Завдання 4: Додавання нового студента
app.post("/students", (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        group: req.body.group
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Завдання 5: Оновлення даних студента
app.put("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        student.name = req.body.name || student.name;
        student.group = req.body.group || student.group;
        res.json(student);
    } else {
        res.status(404).send("Студента не знайдено");
    }
});

// Завдання 5: Видалення студента
app.delete("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    students = students.filter(s => s.id !== studentId);
    res.send(`Студента з ID ${studentId} видалено`);
});

// Запуск сервера
app.listen(3000, () => {
    console.log("Server started on port 3000");
});