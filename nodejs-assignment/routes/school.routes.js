const { Router } = require('express');
const { SchoolController } = require('../controllers/SchoolController');

const router = Router();

sc = new SchoolController();

router.post('/addSchool', sc.createSchool);
router.get('/listSchools', sc.listSchools);

module.exports = router;