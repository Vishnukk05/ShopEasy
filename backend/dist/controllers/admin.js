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
exports.sendCampaign = exports.getCampaigns = exports.resolveTicket = exports.createTicket = exports.getTickets = exports.deleteBanner = exports.createBanner = exports.getBanners = exports.deleteUser = exports.getUsers = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json(users);
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
exports.deleteUser = deleteUser;
const getBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banners = yield db_1.default.banner.findMany();
    res.json(banners);
});
exports.getBanners = getBanners;
const createBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield db_1.default.banner.create({ data: req.body });
    res.json(banner);
});
exports.createBanner = createBanner;
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.banner.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});
exports.deleteBanner = deleteBanner;
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield db_1.default.ticket.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(tickets);
});
exports.getTickets = getTickets;
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield db_1.default.ticket.create({ data: req.body });
    res.json(ticket);
});
exports.createTicket = createTicket;
const resolveTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield db_1.default.ticket.update({ where: { id: req.params.id }, data: { status: 'RESOLVED' } });
    res.json(ticket);
});
exports.resolveTicket = resolveTicket;
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campaigns = yield db_1.default.campaign.findMany({ orderBy: { sentAt: 'desc' } });
    res.json(campaigns);
});
exports.getCampaigns = getCampaigns;
const sendCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In reality, this would send an email. We just log it to DB.
    const campaign = yield db_1.default.campaign.create({ data: req.body });
    res.json(campaign);
});
exports.sendCampaign = sendCampaign;
