import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class Home extends Component{
	render(){
		return(
			<div className="container">
				<div className="content">
				    <div className="title m-b-md">
				        <img src="/static/images/logo.png" /> <span style={{'fontFamily': 'Raleway'}}><b style={{'letterSpacing': 7+ 'px'}}>BIOPS</b> <i>Utilities</i></span>
				    </div>
				    <div className="links">
				        <div className="app_container row">
				        	<div className=" col-sm-4">
				        		<Link to="/extractor">
					        		<div className="app_link">
							                <img src="http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-7/96/Extract-object-icon.png" />
					        		</div>
					        		<h4>Group Genie Extractor</h4>
				        		</Link>
				        	</div>
				            <a className="app_link col-sm-4"></a>
				            <a className="app_link col-sm-4"></a>
				        </div>
				    </div>
				</div>
			</div>
			)
	}
}

export default Home;