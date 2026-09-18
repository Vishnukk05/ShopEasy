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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, search } = req.query;
        const products = yield db_1.default.product.findMany({
            where: Object.assign(Object.assign({ isActive: true }, (category ? { categoryId: String(category) } : {})), (search ? {
                OR: [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { description: { contains: String(search), mode: 'insensitive' } },
                ],
            } : {})),
            include: { category: true },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield db_1.default.product.findUnique({
            where: { id: String(id) },
            include: { category: true },
        });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, description, price, originalPrice, rating, stockQuantity, categoryId, images } = req.body;
        const product = yield db_1.default.product.create({
            data: {
                name,
                slug,
                description,
                price,
                originalPrice,
                rating,
                stockQuantity,
                categoryId,
                images,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, slug, description, price, originalPrice, rating, stockQuantity, categoryId, images } = req.body;
        const product = yield db_1.default.product.update({
            where: { id: String(id) },
            data: {
                name,
                slug,
                description,
                price,
                originalPrice,
                rating,
                stockQuantity,
                categoryId,
                images,
            },
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Manual cascade delete to avoid foreign key constraint errors
        yield db_1.default.cartItem.deleteMany({ where: { productId: String(id) } });
        yield db_1.default.orderItem.deleteMany({ where: { productId: String(id) } });
        yield db_1.default.product.delete({
            where: { id: String(id) }
        });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteProduct = deleteProduct;
