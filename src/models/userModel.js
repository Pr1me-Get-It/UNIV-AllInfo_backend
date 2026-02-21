import { query } from "../config/dbConnect.js";

class User {
  constructor(
    email,
    expoPushToken = null,
    name,
    college,
    department,
    studentId,
    academicStatus,
    birthDate
  ) {
    this.email = email;
    this.expoPushToken = expoPushToken || null;
    this.name = name;
    this.college = college;
    this.department = department;
    this.studentId = studentId;
    this.academicStatus = academicStatus;
    this.birthDate = birthDate;
  }
}

const getAll = async () => {
  return await query("SELECT * FROM users");
};

const create = async (user) => {
  const result = await query(
    `INSERT INTO users (
      email,
      expo_push_token,
      name,
      college,
      department,
      student_id,
      academic_status,
      birth_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.email,
      user.expoPushToken,
      user.name,
      user.college,
      user.department,
      user.studentId,
      user.academicStatus,
      user.birthDate,
    ]
  );
};

export const userModel = { getAll, create };
export default User;

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   expoPushToken: { type: String, default: null },
//   keywordForPush: { type: [String], default: [] },
// });

// const User = mongoose.model("User", userSchema);

// export default User;
