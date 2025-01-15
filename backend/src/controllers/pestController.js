const Pest = require('../models/Pest');
const Crop = require('../models/Crop');

const createPest = async (req, res) => {
  try {
    const { 
      name, 
      scientificName, 
      description, 
      symptoms, 
      controlMethods,
      affectedCrops 
    } = req.body;

    const pest = await Pest.create({
      name,
      scientificName,
      description,
      symptoms,
      controlMethods,
      affectedCrops,
      addedBy: req.user.userId
    });

    // Update affected crops with the new pest
    if (affectedCrops && affectedCrops.length > 0) {
      await Crop.updateMany(
        { _id: { $in: affectedCrops } },
        { $push: { pests: pest._id } }
      );
    }

    res.status(201).json(pest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePest = async (req, res) => {
  try {
    const { pestId } = req.params;
    const updates = req.body;

    const pest = await Pest.findById(pestId);
    if (!pest) {
      return res.status(404).json({ message: 'Pest not found' });
    }

    // Handle updating affected crops
    if (updates.affectedCrops) {
      // Remove pest from crops that are no longer affected
      await Crop.updateMany(
        { _id: { $in: pest.affectedCrops } },
        { $pull: { pests: pest._id } }
      );

      // Add pest to newly affected crops
      await Crop.updateMany(
        { _id: { $in: updates.affectedCrops } },
        { $addToSet: { pests: pest._id } }
      );
    }

    Object.assign(pest, updates);
    await pest.save();

    res.json(pest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPests = async (req, res) => {
  try {
    const pests = await Pest.find()
      .populate('affectedCrops', 'name farmerId')
      .populate('addedBy', 'name')
      .sort('-createdAt');

    res.json(pests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePest = async (req, res) => {
  try {
    const { pestId } = req.params;
    
    const pest = await Pest.findById(pestId);
    if (!pest) {
      return res.status(404).json({ message: 'Pest not found' });
    }

    // Remove pest reference from all affected crops
    await Crop.updateMany(
      { pests: pestId },
      { $pull: { pests: pestId } }
    );

    await pest.remove();

    res.json({ message: 'Pest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPest,
  updatePest,
  getAllPests,
  deletePest
};