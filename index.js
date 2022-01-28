// Active les variables d'environnement de .env
require("dotenv").config();

// Import des packages
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
// Package mailgun + configuration apiKey et domain
const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY_MAILGUN,
  domain: process.env.DOMAIN_MAILGUN,
});

const app = express();
app.use(formidable());
app.use(cors());

// Route qui s'occupe de l'envoie du mail grace à mailgun
app.post("/form", (req, res) => {
  // Comme dans la doc : on créé un obj data pour s'en servir dans la méthode mailgun.message().send(*ICI DATA*)
  const data = {
    from: `${req.fields.firstName} ${req.fields.lastName} ${req.fields.email}`,
    to: "kevinmaslowski@gmail.com",
    subject: req.fields.sujet,
    text: req.fields.message,
  };

  // Comme dans la doc : fonctions fournies par le package mailgun pour créer le mail et l'envoyer :
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    if (error === undefined) {
      // s'il n'y a pas eu d'erreur lors de l'envoi du mail, on envoie la réponse suivante au frontend :
      res.json({ message: "Les données du form ont été reçues et envoyées" });
    } else {
      res.json(error);
    }
  });
});

app.listen(process.env.PORT);
