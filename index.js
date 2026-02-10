require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const EMAIL = "ashmita1715.be23@chitkara.edu.in";
const PORT = process.env.PORT || 3000;

/* ---------- helpers ---------- */

const fibonacci = (n) => {
  const res = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    res.push(a);
    [a, b] = [b, a + b];
  }
  return res;
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++)
    if (n % i === 0) return false;
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const lcm = (arr) =>
  arr.reduce((a, b) => (a * b) / gcd(a, b));

const hcf = (arr) =>
  arr.reduce((a, b) => gcd(a, b));

/* ---------- routes ---------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const key = Object.keys(body)[0];
    let data;

    if (key === "fibonacci") {
      data = fibonacci(body.fibonacci);
    } 
    else if (key === "prime") {
      data = body.prime.filter(isPrime);
    } 
    else if (key === "lcm") {
      data = lcm(body.lcm);
    } 
    else if (key === "hcf") {
      data = hcf(body.hcf);
    } 
    else if (key === "AI") {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: body.AI }] }]
        }
      );
      data =
        response.data.candidates[0].content.parts[0].text
          .trim()
          .split(" ")[0];
    } 
    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL
      });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: EMAIL
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);