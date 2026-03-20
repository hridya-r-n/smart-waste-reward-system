const Report = require("../models/report");

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find(); // no populate
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resolve report
exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};