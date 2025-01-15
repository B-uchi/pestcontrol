const Crop = require('../models/Crop');

const registerCrop = async (req, res) => {
  try {
    const { name, variety, plantingDate, location } = req.body;
    
    const crop = await Crop.create({
      farmerId: req.user.userId,
      name,
      variety,
      plantingDate,
      location
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const updates = req.body;

    const crop = await Crop.findOne({ 
      _id: cropId,
      farmerId: req.user.userId // Ensure farmer owns the crop
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    Object.assign(crop, updates);
    await crop.save();

    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFarmerCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user.userId })
      .populate('pests', 'name symptoms controlMethods scientificName description')
      .sort('-createdAt');

    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate('farmerId', 'name')
      .populate('pests', 'name')
      .sort('-createdAt');

    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const crop = await Crop.findOneAndDelete({ 
      _id: cropId,
      farmerId: req.user.userId 
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCrop,
  updateCrop,
  getFarmerCrops,
  getAllCrops,
  deleteCrop
};