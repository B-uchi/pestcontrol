const Report = require('../models/Report');
const User = require('../models/User');

const createReport = async (req, res) => {
  try {
    const { location, description, firstNoticed } = req.body;
    const report = await Report.create({
      farmerId: req.user.userId,
      location,
      description,
      firstNoticed: firstNoticed || new Date(),
    });
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, actionTaken, comments, success } = req.body;
    
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    if (status === 'completed') {
      report.pestControlAction = {
        agentId: req.user.userId,
        actionTaken,
        comments,
        success,
        completedAt: new Date()
      };
    }

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'farmer') {
      query.farmerId = req.user.userId;
    }

    const reports = await Report.find(query)
      .populate('farmerId', 'name')
      .populate('pestControlAction.agentId', 'name')
      .sort('-createdAt');
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const reports = await Report.find(query);
    
    const summary = {
      total: reports.length,
      completed: reports.filter(r => r.status === 'completed').length,
      pending: reports.filter(r => r.status === 'pending').length,
      inProgress: reports.filter(r => r.status === 'in-progress').length,
      successRate: reports.filter(r => r.pestControlAction?.success).length / reports.length
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  updateReport,
  getReports,
  generateSummaryReport
};