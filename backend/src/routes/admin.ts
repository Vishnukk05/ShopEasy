import { Router } from 'express';
import { getUsers, deleteUser, getBanners, createBanner, deleteBanner, getTickets, resolveTicket, getCampaigns, sendCampaign, createTicket } from '../controllers/admin';

const router = Router();

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.delete('/banners/:id', deleteBanner);

router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id/resolve', resolveTicket);

router.get('/campaigns', getCampaigns);
router.post('/campaigns', sendCampaign);

export default router;

