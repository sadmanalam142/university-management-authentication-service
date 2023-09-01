"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = exports.facultySchema = void 0;
const mongoose_1 = require("mongoose");
const student_constant_1 = require("../student/student.constant");
exports.facultySchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: false,
            },
        },
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: student_constant_1.gender,
    },
    bloodGroup: {
        type: String,
        enum: student_constant_1.bloodGroup,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    contactNo: {
        type: String,
        unique: true,
        required: true,
    },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        // required: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Faculty = (0, mongoose_1.model)('Faculty', exports.facultySchema);
