const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllCharacters = async (req, res) => {
  // #swagger.tags = ['Characters']
  const result = await mongodb
    .getDb()
    .db()
    .collection("characters")
    .find();
  result
    .toArray((err, lists) => {
      if (err) {
        res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving characters.",
        });
      }
    })
    .then((characters) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(characters);
    });
};

const getCharacterById = async (req, res) => {
  // #swagger.tags = ['Characters']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid character ID." });
  }
  const characterId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("characters")
    .find({ _id: characterId });
  result.toArray().then((characters) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(characters);
  });
};

const createCharacter = async (req, res) => {
  // #swagger.tags = ['Characters']
  /*
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
          $charName: 'Arannis',
          $charRace: 'Elf',
          $charClass: 'Ranger',
          $charLevel: 5,
          $charAlignment: 'Neutral Good',
          $charBackground: 'Outlander',
          charAge: 120,
          charHeight: 72,
          charWeight: 160,
          charEyes: 'Green',
          charSkin: 'Fair',
          charBonds: 'Protect my homeland',
          charFlaws: 'Too trusting',
          charIdeals: 'Freedom',
          charPersonalityTraits: 'Calm under pressure',
          $hp: 42,
          $ac: 16,
          $str: 14,
          $dex: 17,
          $con: 13,
          $int: 12,
          $wis: 15,
          $cha: 10
                }
            }
        */
  if (!req.body) {
    return res.status(400).json({ message: "Request body is required." });
  }

  const newCharacter = {
    charName: req.body.charName,
    charRace: req.body.charRace,
    charClass: req.body.charClass,
    charLevel: req.body.charLevel,
    charAlignment: req.body.charAlignment,
    charBackground: req.body.charBackground,
    charAge: req.body.charAge,
    charHeight: req.body.charHeight,
    charWeight: req.body.charWeight,
    charEyes: req.body.charEyes,
    charSkin: req.body.charSkin,
    charBonds: req.body.charBonds,
    charFlaws: req.body.charFlaws,
    charIdeals: req.body.charIdeals,
    charPersonalityTraits: req.body.charPersonalityTraits,
    hp: req.body.hp,
    ac: req.body.ac,
    str: req.body.str,
    dex: req.body.dex,
    con: req.body.con,
    int: req.body.int,
    wis: req.body.wis,
    cha: req.body.cha,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("characters")
    .insertOne(newCharacter);
  res.setHeader("Content-Type", "application/json");
  if (response.acknowledged) {
    res.status(201).json(newCharacter);
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while adding the character.",
      );
  }
};

const updateCharacter = async (req, res) => {
  // #swagger.tags = ['Characters']
  /*
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
          $charName: 'Arannis',
          $charRace: 'Elf',
          $charClass: 'Ranger',
          $charLevel: 5,
          $charAlignment: 'Neutral Good',
          $charBackground: 'Outlander',
          charAge: 120,
          charHeight: 72,
          charWeight: 160,
          charEyes: 'Green',
          charSkin: 'Fair',
          charBonds: 'Protect my homeland',
          charFlaws: 'Too trusting',
          charIdeals: 'Freedom',
          charPersonalityTraits: 'Calm under pressure',
          $hp: 42,
          $ac: 16,
          $str: 14,
          $dex: 17,
          $con: 13,
          $int: 12,
          $wis: 15,
          $cha: 10
                }
            }
        */
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid character ID." });
  }
  const characterId = new ObjectId(req.params.id);
  if (!req.body) {
    return res.status(400).json({ message: "Request body is required." });
  }

  const updatedCharacter = {
    charName: req.body.charName,
    charRace: req.body.charRace,
    charClass: req.body.charClass,
    charLevel: req.body.charLevel,
    charAlignment: req.body.charAlignment,
    charBackground: req.body.charBackground,
    charAge: req.body.charAge,
    charHeight: req.body.charHeight,
    charWeight: req.body.charWeight,
    charEyes: req.body.charEyes,
    charSkin: req.body.charSkin,
    charBonds: req.body.charBonds,
    charFlaws: req.body.charFlaws,
    charIdeals: req.body.charIdeals,
    charPersonalityTraits: req.body.charPersonalityTraits,
    hp: req.body.hp,
    ac: req.body.ac,
    str: req.body.str,
    dex: req.body.dex,
    con: req.body.con,
    int: req.body.int,
    wis: req.body.wis,
    cha: req.body.cha,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("characters")
    .replaceOne({ _id: characterId }, updatedCharacter);
  res.setHeader("Content-Type", "application/json");
  if (response.modifiedCount > 0) {
    res.status(200).json(updatedCharacter);
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while updating the character.",
      );
  }
};

const deleteCharacter = async (req, res) => {
  // #swagger.tags = ['Characters']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid character ID." });
  }
  const characterId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("characters")
    .deleteOne({ _id: characterId });
  res.setHeader("Content-Type", "application/json");
  if (response.deletedCount > 0) {
    res.status(200).json({ message: "Character deleted successfully." });
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while deleting the character.",
      );
  }
};

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
