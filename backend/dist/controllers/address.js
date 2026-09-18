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
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddresses = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            const headerUserId = req.headers['x-user-id'];
            if (!headerUserId)
                return res.status(401).json({ message: 'Unauthorized' });
            const addresses = yield db_1.default.address.findMany({ where: { userId: String(headerUserId) } });
            return res.json(addresses);
        }
        const addresses = yield db_1.default.address.findMany({ where: { userId } });
        res.json(addresses);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAddresses = getAddresses;
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headerUserId = req.headers['x-user-id'];
        if (!headerUserId)
            return res.status(401).json({ message: 'Unauthorized' });
        const address = yield db_1.default.address.create({
            data: Object.assign(Object.assign({}, req.body), { userId: String(headerUserId) })
        });
        res.status(201).json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createAddress = createAddress;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const address = yield db_1.default.address.update({
            where: { id: String(id) },
            data: req.body
        });
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.default.address.delete({ where: { id: String(id) } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAddress = deleteAddress;
