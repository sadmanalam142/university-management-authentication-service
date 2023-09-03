"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../../config"));
const acdemicSemester_model_1 = require("../academicSemester/acdemicSemester.model");
const user_utils_1 = require("./user.utils");
const student_model_1 = require("../student/student.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const faculty_model_1 = require("../faculty/faculty.model");
const admin_model_1 = require("../admin/admin.model");
// import bcrypt from 'bcrypt';
// creating user and student
const createStudent = (student, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = config_1.default.default_user_pass;
    }
    // user.password = await bcrypt.hash(user.password, 10);
    user.role = 'student';
    const academicsemester = yield acdemicSemester_model_1.AcademicSemester.findById(student.academicSemester).lean();
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const id = yield (0, user_utils_1.generateStudentId)(academicsemester);
        user.id = id;
        student.id = id;
        const createdStudent = yield student_model_1.Student.create([student], { session });
        if (!createdStudent.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create student');
        }
        user.student = createdStudent[0]._id;
        const createdUser = yield user_model_1.User.create([user], { session });
        if (!createdUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserData = createdUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ id: newUserData.id }).populate({
            path: 'student',
            populate: [
                {
                    path: 'academicFaculty',
                },
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicSemester',
                },
            ],
        });
    }
    return newUserData;
});
// creating user and faculty
const createFaculty = (faculty, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = config_1.default.default_user_pass;
    }
    user.role = 'faculty';
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const id = yield (0, user_utils_1.generateFacultyId)();
        user.id = id;
        faculty.id = id;
        const createdFaculty = yield faculty_model_1.Faculty.create([faculty], { session });
        if (!createdFaculty.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create faculty');
        }
        user.faculty = createdFaculty[0]._id;
        const createdUser = yield user_model_1.User.create([user], { session });
        if (!createdUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserData = createdUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ id: newUserData.id }).populate({
            path: 'faculty',
            populate: [
                {
                    path: 'academicFaculty',
                },
                {
                    path: 'academicDepartment',
                },
            ],
        });
    }
    return newUserData;
});
// creating user and admin
const createAdmin = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = config_1.default.default_user_pass;
    }
    user.role = 'admin';
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const id = yield (0, user_utils_1.generateAdminId)();
        user.id = id;
        admin.id = id;
        const createdAdmin = yield admin_model_1.Admin.create([admin], { session });
        if (!createdAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        user.admin = createdAdmin[0]._id;
        const createdUser = yield user_model_1.User.create([user], { session });
        if (!createdUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserData = createdUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ id: newUserData.id }).populate({
            path: 'admin',
            populate: [
                {
                    path: 'managementDepartment',
                },
            ],
        });
    }
    return newUserData;
});
exports.UserService = {
    createStudent,
    createFaculty,
    createAdmin,
};
