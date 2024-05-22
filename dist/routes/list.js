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
const express_1 = require("express");
const list_1 = __importDefault(require("../models/list"));
const router = (0, express_1.Router)();
// Add to My List
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId, itemType } = req.body;
    try {
        const list = yield list_1.default.findOneAndUpdate({ userId }, { $addToSet: { items: { itemId, itemType } } }, { new: true, upsert: true });
        res.status(200).json(list);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
// Remove from My List
router.post('/remove', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, itemId } = req.body;
    try {
        const list = yield list_1.default.findOneAndUpdate({ userId }, { $pull: { items: { itemId } } }, { new: true });
        res.status(200).json(list);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
// List My Items
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const list = yield list_1.default.findOne({ userId });
        res.status(200).json(list);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}));
exports.default = router;
