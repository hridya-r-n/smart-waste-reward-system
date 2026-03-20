const Report = require("../models/report");
const User = require("../models/user");

// Create report
exports.createReport = async (req, res) => {
  try {
    const { userId, location, wasteType, severity } = req.body;

    console.log("BODY:", req.body); // debug

    // ✅ Prevent crash
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const report = new Report({
      user: userId,
      location,
      wasteType,
      severity
    });

    await report.save();

    // ✅ Safe points update
    await User.findByIdAndUpdate(userId, {
      $inc: { points: 10 }
    });

    res.json(report);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get reports (SAFE VERSION - NO POPULATE)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find(); // ✅ FIXED
    res.json(reports);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};