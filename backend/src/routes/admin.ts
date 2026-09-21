import { Router } from 'express';
import { getUsers, deleteUser, createUser, getBanners, createBanner, deleteBanner, getTickets, resolveTicket, getCampaigns, sendCampaign, createTicket, getOrders, updateOrderStatus } from '../controllers/admin';

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.delete('/banners/:id', deleteBanner);

router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id/resolve', resolveTicket);

router.get('/campaigns', getCampaigns);
router.post('/campaigns', sendCampaign);

router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;

