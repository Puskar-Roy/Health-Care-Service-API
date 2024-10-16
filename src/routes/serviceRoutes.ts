import { Router } from 'express';
import {
  addService,
  getAllServices,
  updateService,
  deleteService,
} from '../controllers/serviceController';

const router: Router = Router();

router.post('/', addService);
router.get('/', getAllServices);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
