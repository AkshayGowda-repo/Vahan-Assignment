const express = require("express");
const router = express.Router();
const controller = require("../controllers/entity.controller");

router.post("/entity", controller.createEntity);
router.post("/:entityName", controller.createEntry);
router.get("/:entityName", controller.readEntries);
router.put("/:entityName/:id", controller.updateEntry);
router.delete("/:entityName/:id", controller.deleteEntry);

module.exports = router;
