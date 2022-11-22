const { Note, User } = require("../models/models");
const ApiError = require("../error/ApiError");

class NoteController {
  getAllNotes = async (req, res, next) => {
    try {
      const notes = await Note.findAll();
      if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" });
      }

      // const notesWithUser = await Promise.all(
      //   notes.map(async (note) => {
      //     const user = await User.findOne({
      //       where: { id: userId },
      //     });
      //     return { ...note, username: user.username };
      //   })
      // );

      res.json(notes);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  };
  getNote = async (req, res, next) => {
    try {
      const { id } = req.params;
      const note = await Note.findOne({
        where: { id },
      });
      return res.json(note);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  };

  createNewNote = async (req, res, next) => {
    const { userId, title, text, completed } = req.body;

    try {
      // Confirm data
      if (!title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check for duplicate title
      const duplicate = await Note.findOne({
        where: { title },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Duplicate note title" });
      }

      // Create and store the new user
      const note = await Note.create({ userId, title, text, completed });

      if (note) {
        // Created
        return res.status(201).json({ message: "New note created" });
      }
    } catch (error) {
      next(ApiError.badRequest("Invalid note data received"));
    }
  };

  updateNote = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const { userId, title, text, completed } = data;

    // Confirm data
    if (!title || !text || typeof completed !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      // Confirm note exists to update
      const note = await Note.update(data, {
        where: { id },
      });

      res.json(`User updated`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  deleteNote = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Note.destroy({ where: { id } });

      const reply = `Note deleted`;

      res.json(reply);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  };
}

module.exports = new NoteController();
