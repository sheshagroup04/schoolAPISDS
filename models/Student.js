const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  dob: { type: String, required: true },
  mobileNo: { type: String, required: true },
  address: { type: String, required: true },
  feePaid: { type: String, enum: ["paid", "pending"], default: "pending" },
  status: { type: String, enum: ["present", "absent"], default: "absent" },
  userRole: { type: String, default: "student" }
});

// Pre-save hook to hash the password
StudentSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Method to compare password
StudentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Student", StudentSchema);
