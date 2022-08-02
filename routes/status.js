import express from 'express';
const router = express.Router();

router.get('/success', (req, res) => {
    return res.status(200).json({msg: 'success!'});
});

router.get('/badrequest', (req, res) => {
    return res.status(400).json({msg: 'bad request!'});
});

router.get('/unauthorized', (req, res) => {
    return res.status(401).json({msg: 'unauthorized!'});
});

export default router;