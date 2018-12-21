const express = require('express');
const router = express.Router();
const path = require('path');


const Extractor = require(path.resolve(__dirname + './../../controllers/Extractor/ExtractorController'));



//--------------------------API ENDPOINTS------------------------------------
router.get('/api/extractor', (req, res)=>Extractor.getShowView(req, res));
router.post('/api/extractor', (req, res)=>Extractor.postRequestToGroupGenie(req, res));

//!!--------------------------API ENDPOINTS------------------------------------

router.get('*', (req, res)=>{
	res.sendFile(path.resolve(__dirname + './../../../public/index.html'));
});

module.exports = router;