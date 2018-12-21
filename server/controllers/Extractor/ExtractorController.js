const axios = require('axios');
const http = require('http');
const querystring = require('querystring')


class Extractors{

	/**
	 * @param  {[object]}
	 * @param  {[object]}
	 * @return {[html]}
	 */
	getShowView(req, res){
		
		axios.get('http://groupgenie.pg.com/grpgenie/index.php',{
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Cookie': `PHPSESSID=cu1bkaa825gjoeg0ehpm9o8ql6; _ga=GA1.2.1628632960.1523794139; _groupfilter=; _extshortname=bioperations.im; SMSESSION=${req.query.session}`,
				'Host': 'groupgenie.pg.com',
				'Pragma': 'no-cache',
				'Upgrade-Insecure-Requests': 1,
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
			}
		})
		.then((response)=>{
			res.send(JSON.stringify({success: true, data: response.data}));
		})
		.catch((err)=>{
			res.send(JSON.stringify({success: false}));
		});
	}

	/**creates the link and parameters of the link to be requested in groupgenie page
	 * @param  {[object]}
	 * @param  {[object]}
	 * @return {[null]}
	 */
	postRequestToGroupGenie(req, res){
		if (req.body.group != undefined) {
			const link = `http://groupgenie.pg.com/grpgenie/repmemx.php`;
			const params = `mode=1&format=html&group=${req.body.group}${req.body.filter}`;
			this.requestTheViewPage(link, params, res ,req);
			
		}else if (req.body.tnumber != undefined) {
			const link = `http://groupgenie.pg.com/grpgenie/repgmem.php`;
			const params = `mode=1&extshortname=${req.body.tnumber}&group=&defbut=OK`;
			this.requestTheViewPage(link, params, res ,req);
		}
	}

	/**issues post request to group genie
	 * @param  {[string] (link_params) link to issue a post request}
	 * @param  {[string] query fields}
	 * @param  {[object] response object}
	 * @param  {[string] hashed session from group genie}
	 * @return {[object] sends response to the view page}
	 */
	requestTheViewPage(link, params, res, req){
		
		return axios.post(link, params,
		{
			headers: {
				'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
				'Host': `groupgenie.pg.com`,
				'Connection': `keep-alive`,
				'Pragma': `no-cache`,
				'Cache-Control': `no-cache`,
				'Origin': `http://groupgenie.pg.com`,
				'Upgrade-Insecure-Requests': 1,
				'Content-Type': `application/x-www-form-urlencoded`,
				'User-Agent': `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36`,
				'Referer': `http://groupgenie.pg.com/grpgenie/repmemx.php?`,
				'Accept-Encoding': `gzip, deflate`,
				'Accept-Language': `en-US,en;q=0.9`,
				'Cookie': `PHPSESSID=cu1bkaa825gjoeg0ehpm9o8ql6; _ga=GA1.2.1628632960.1523794139; _groupfilter=CISG-SKII; _extshortname=bioperations.im; SMSESSION=${req.body.session}`
			}
		})
		.then((response)=>{
			res.send(JSON.stringify({success: true, data: response.data}));
		})
		.catch((err)=>{
			res.send(JSON.stringify({success: false}));
		});
	}
}

const Extractor = new Extractors;

module.exports=Extractor;

