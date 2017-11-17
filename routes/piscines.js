const express = require("express");
const Joi = require("joi");
const router = express.Router();

const Piscine = require("../models/Piscine");

const schema = Joi.object().keys({
  nom: Joi.string().required(),
  adresse: Joi.string().required()
});

router
  .route("/")
  .get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    Piscine.find((err, piscines) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(piscines);
      }
    });
  })
  .post((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const ret = Joi.validate(req.body, schema, {
      allowUnknown: true,
      abortEarly: false
    });
    if (ret.error) {
      res.status(500).send(ret.error.details);
    } else {
      const piscine = new Piscine();
      piscine.nom = ret.value.nom;
      piscine.adresse = ret.value.adresse;
      piscine.tel = ret.value.tel;
      piscine.description = ret.value.description;
      piscine.save(err => {
        if (err) {
          res.status(500).send(err);
        }
        res.send(piscine);
      });
    }
  });

router
  .route("/:piscine_id")
  .get((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    Piscine.findById(req.params.piscine_id, (err, piscine) => {
      if (err) res.status(500).send(err);
      res.json(piscine);
    });
  })
  .put((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    Piscine.findById(req.params.piscine_id, (err, piscine) => {
      if (err) {
        res.status(500).send(err);
      }
      // Mise à jour des données de la piscine
      piscine.nom = req.body.nom;
      piscine.adresse = req.body.adresse;
      piscine.tel = req.body.tel;
      piscine.description = req.body.description;
      piscine.save(err => {
        if (err) {
          res.status(500).send(err);
        }
        // Si tout est ok
        res.json({ message: "Bravo, mise à jour des données OK" });
      });
    });
  })
  .delete((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    Piscine.remove({ _id: req.params.piscine_id }, err => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ message: "Bravo, piscine supprimée" });
    });
  });

module.exports = router;
