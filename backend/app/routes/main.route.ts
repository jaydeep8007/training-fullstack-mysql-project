import express from 'express';
const router = express.Router();
// const VERIFY = require('../util/userAuth');
import adminRoutes from './admin.route';
import customerRoutes from './customer.route';
import empoyeeRoutes from './employee.route';
import jobRoutes from './job.route';
import employeeJobRoutes from './employeeJob.route';
import globalConfigRoutes from './globalConfig.route';
import permissionRoutes from './adminPermission.route'
import roleRoutes from './role.route'
import resourceRoutes from './resource.route'
import stripeRoutes from './stripe.route';

router.use('/admin',adminRoutes)
router.use('/customer', customerRoutes);
router.use('/employee', empoyeeRoutes);
router.use('/job', jobRoutes);
router.use('/employee-job', employeeJobRoutes);
router.use('/global-config', globalConfigRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/resources', resourceRoutes);
router.use('/stripe', stripeRoutes);

export default router;
