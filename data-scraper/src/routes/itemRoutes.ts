import express from "express";
import {
    getAllStoreItems,
    getAllItems
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getAllStoreItems);

router.get("/items", getAllItems);

export default router;