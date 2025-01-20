const Crop = require("../models/Crop");
const Pest = require("../models/Pest");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const [farmers, agents, crops, pests] = await Promise.all([
      User.find({ role: 'farmer' })
        .populate('crops')
        .lean(),
      User.find({ role: 'pestcontrol' })
        .populate('pestsManaged')
        .lean(),
      Crop.countDocuments(),
      Pest.countDocuments()
    ]);

    const stats = {
      totalFarmers: farmers.length,
      totalAgents: agents.length,
      totalCrops: crops,
      totalPests: pests,
      activeFarmers: farmers.filter(f => f.crops && f.crops.length > 0).length,
      activeAgents: agents.filter(a => a.pestsManaged && a.pestsManaged.length > 0).length,
      averageCropsPerFarmer: farmers.length 
        ? (crops / farmers.length).toFixed(2) 
        : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['farmer', 'pestcontrol'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Create the populate options based on role
    const populateOptions = role === 'farmer' 
      ? {
          path: 'crops',
          select: 'name status plantingDate location'
        }
      : {
          path: 'pestsManaged',
          select: 'name scientificName affectedCrops'
        };

    // Find users and populate virtual fields
    const users = await User.find({ role })
      .select('-password')
      .populate(populateOptions);
      
    // Format the response data
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      farmLocation: user.farmLocation,
      createdAt: user.createdAt,
      activityCount: role === 'farmer' 
        ? (user.crops && user.crops.length) || 0
        : (user.pestsManaged && user.pestsManaged.length) || 0,
      activityDetails: role === 'farmer'
        ? user.crops?.map(crop => ({
            name: crop.name,
            status: crop.status,
            plantingDate: crop.plantingDate,
            location: crop.location
          }))
        : user.pestsManaged?.map(pest => ({
            name: pest.name,
            scientificName: pest.scientificName,
            affectedCropsCount: pest.affectedCrops?.length || 0
          }))
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    res.status(500).json({ message: error.message });
  }
};

const getActivityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set the time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const [newUsers, newCrops, pestReports, timeline] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      Crop.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      Pest.countDocuments({
        createdAt: { $gte: start, $lte: end }
      }),
      generateTimeline(start, end)
    ]);

    res.json({
      newUsers,
      newCrops,
      pestReports,
      timeline
    });
  } catch (error) {
    console.error('Activity report error:', error);
    res.status(500).json({ message: error.message });
  }
};

const generateTimeline = async (start, end) => {
  try {
    const cropPipeline = [
      { 
        $match: { 
          createdAt: { $gte: start, $lte: end } 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const pestPipeline = [
      { 
        $match: { 
          createdAt: { $gte: start, $lte: end } 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const [cropResults, pestResults] = await Promise.all([
      Crop.aggregate(cropPipeline),
      Pest.aggregate(pestPipeline)
    ]);

    const timeline = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const cropData = cropResults.find(r => r._id === dateStr);
      const pestData = pestResults.find(r => r._id === dateStr);

      timeline.push({
        date: dateStr,
        crops: cropData?.count || 0,
        pests: pestData?.count || 0
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeline;
  } catch (error) {
    console.error('Timeline generation error:', error);
    return [];
  }
};

module.exports = {
  getDashboardStats,
  getUsersByRole,
  getActivityReport
};