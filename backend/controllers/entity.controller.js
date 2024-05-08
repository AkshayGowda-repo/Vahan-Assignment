const db = require("../models");
const { Sequelize } = db;

function createDynamicModel(entityName, attributes) {
  const fields = {};
  attributes.forEach((attr) => {
    fields[attr.name] = {
      type: Sequelize[attr.type.toUpperCase()],
      allowNull: attr.allowNull !== false,
    };
  });

  const model = db.sequelize.define(entityName, fields, {
    freezeTableName: true,
  });
  db.dynamicModels[entityName] = model;
  model.sync(); // Create table if not exists
}

exports.createEntity = (req, res) => {
  const { entityName, attributes } = req.body;
  if (db.dynamicModels[entityName]) {
    return res.status(400).json({ message: "Entity already exists" });
  }

  try {
    createDynamicModel(entityName, attributes);
    res.status(201).json({ message: `${entityName} entity created` });
  } catch (err) {
    res.status(500).json({ message: "Error creating entity", error: err });
  }
};

exports.createEntry = async (req, res) => {
  const { entityName } = req.params;
  const model = db.dynamicModels[entityName];

  if (!model) return res.status(404).json({ message: "Entity not found" });

  try {
    if (req.body.mobileNumber) {
      req.body.mobileNumber = parseInt(req.body.mobileNumber, 10);
    }
    if (req.body.dateOfBirth) {
      req.body.dateOfBirth = new Date(req.body.dateOfBirth);
    }

    const entry = await model.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating entry", error: err.message });
  }
};

exports.readEntries = async (req, res) => {
  const { entityName } = req.params;
  const model = db.dynamicModels[entityName];

  if (!model) return res.status(404).json({ message: "Entity not found" });

  try {
    const entries = await model.findAll();
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: "Error reading entries", error: err });
  }
};

exports.updateEntry = async (req, res) => {
  const { entityName, id } = req.params;
  const model = db.dynamicModels[entityName];

  if (!model) return res.status(404).json({ message: "Entity not found" });

  try {
    if (req.body.mobileNumber) {
      req.body.mobileNumber = parseInt(req.body.mobileNumber, 10);
    }
    if (req.body.dateOfBirth) {
      req.body.dateOfBirth = new Date(req.body.dateOfBirth);
    }

    const [updated] = await model.update(req.body, { where: { id } });
    if (updated) {
      const updatedEntry = await model.findByPk(id);
      res.status(200).json(updatedEntry);
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating entry", error: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  const { entityName, id } = req.params;
  const model = db.dynamicModels[entityName];

  if (!model) return res.status(404).json({ message: "Entity not found" });

  try {
    const deleted = await model.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: "Entry deleted" });
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting entry", error: err.message });
  }
};
