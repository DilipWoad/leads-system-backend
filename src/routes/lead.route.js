import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  changeStatus,
  createLead,
  deleteLead,
  getAllLeads,
} from "../controllers/lead.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/").post(createLead).get(getAllLeads);
router.route("/:leadId").patch(changeStatus).delete(deleteLead);

export default router;
