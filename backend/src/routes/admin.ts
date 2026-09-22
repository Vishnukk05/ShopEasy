import { Router } from 'express';
import multer from 'multer';
import { getUsers, deleteUser, createUser, getBanners, createBanner, deleteBanner, getTickets, resolveTicket, getCampaigns, sendCampaign, createTicket, getOrders, updateOrderStatus, createDeal, deleteDeal } from '../controllers/admin';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/users', getUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get('/banners', getBanners);
router.post('/banners', upload.single('image'), createBanner);
router.delete('/banners/:id', deleteBanner);

router.post('/deals', upload.single('image'), createDeal);
router.delete('/deals/:id', deleteDeal);

router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.put('/tickets/:id/resolve', resolveTicket);

router.get('/campaigns', getCampaigns);
router.post('/campaigns', upload.single('image'), sendCampaign);

router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;

