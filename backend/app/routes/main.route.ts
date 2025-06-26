import express from 'express';
const router = express.Router();
// const VERIFY = require('../util/userAuth');
import customerRoutes from './customer.route';
import empoyeeRoutes from './employee.route';
import jobRoutes from './job.route';
import employeeJobRoutes from './employeeJob.route';
import globalConfigRoutes from './globalConfig.route';

router.use('/customer', customerRoutes);
router.use('/employee', empoyeeRoutes);
router.use('/job', jobRoutes);
router.use('/employee-job', employeeJobRoutes);
router.use('/global-config', globalConfigRoutes);

export default router;
