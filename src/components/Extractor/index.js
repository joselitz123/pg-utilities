import React, {Component} from 'react';
import $ from 'jquery';
import { inject, observer} from 'mobx-react';
import { withRouter } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import ExtractGroupModal from './extract_group_modal';
import swal from 'sweetalert2';
window.$ = window.jQuery = $;

class SearchLayout extends Component{
	render(){			

		return(
			<input className="form-control" value={this.props.value} onChange={(e)=>{this.props.input(e)}} />
			)
	}
}

@inject('extractor')
@observer
class Layout extends Component{
	render(){

		const e_store = this.props.extractor;
		const extract_group_button = this.props.extract_group_button_state;
		let button = '';
		if (extract_group_button == true) {
			button = <span><button onClick={()=>this.props.extractGroup()} type="button" className="btn btn-primary btn-sm" >Extract with Group</button>&nbsp;&nbsp;&nbsp;</span>
		}else{
			button = '';
		}

		return(
			<div className="container" id="extractor">
				<div className="row">
					<div className={this.props.loading_state}>
						<div className="loading_container text-center">
							<img src="/static/images/Blocks-1s-200px.svg" onError={()=>{this.onerror=null; this.src='/images/Blocks-1s-200px.png'}} />
							<h3>Fetching Data from Group Genie....</h3>
						</div>
					</div>
					<div className="col-sm-12 text-center">
						<h1>Group Genie Extractor</h1>
					</div>
					<div className="col-sm-12">
						<form onSubmit={(e)=>e_store.searchGroup(e)}>
							<div className="form-group">
								<label>Enter Group to extract</label>
								<SearchLayout value={e_store.search_input} input={(e)=>e_store.searchInput(e.target.value)} />
							</div>
							<button type="submit" className="btn btn-primary btn-sm" >Submit</button>&nbsp;&nbsp;
							{button}
							<span>Filter:</span>&nbsp;&nbsp;&nbsp;
							<input type="checkbox" name="T-number" onChange={(e)=>{this.props.checkBoxInput(e)}} checked={this.props.table_row_name.slice().filter((name)=>{return name.title == 'T-number'}).length != 0 ? true : false} value="&attr%5B%5D=uid" id="tnumber" /> &nbsp;
							<label htmlFor="tnumber">T-number</label>&nbsp;&nbsp;&nbsp;
							<input type="checkbox" name="Shortname" onChange={(e)=>{this.props.checkBoxInput(e)}} checked={this.props.table_row_name.slice().filter((name)=>{return name.title == 'Shortname'}).length != 0 ? true : false} value="&attr%5B%5D=extshortname" id="sname" />&nbsp;
							<label htmlFor="sname">Shortname</label>&nbsp;&nbsp;&nbsp;
							<input type="checkbox" name="Employee Type" onChange={(e)=>{this.props.checkBoxInput(e)}} checked={this.props.table_row_name.slice().filter((name)=>{return name.title == 'Employee Type'}).length != 0 ? true : false} value="&attr%5B%5D=employeetype" id="emp_type" /> &nbsp;
							<label htmlFor="emp_type">Employee Type</label>&nbsp;&nbsp;&nbsp;
							<input type="checkbox" name="Region" onChange={(e)=>{this.props.checkBoxInput(e)}} checked={this.props.table_row_name.slice().filter((name)=>{return name.title == 'Region'}).length != 0 ? true : false} value="&attr%5B%5D=extcountry" id="region" />&nbsp;
							<label htmlFor="region">Region</label>
						</form>
					</div>
					<div className="space" style={{height: 30, width: 100 + '%'}}></div>
					<div className="col-sm-12">
						<ExtractGroupModal modal_state={e_store.modals.extract_progress.visibility} class_style={e_store.progressBarColorCodeComputation} percent={e_store.modals.extract_progress.percent} />
					</div>
				</div>

			</div>
			)
	}	
}


@inject('extractor')
@observer
class Extractor extends Component{

	componentDidMount(){
		this.props.extractor.executeUponMount(); //EXECUTES THE PREREQUISITES ON STORE ONCE COMPONENT IS MOUNTED
	}

	render(){
		
		const e_store = this.props.extractor;
		return(
				<Layout extractGroup={()=>e_store.getFilterstoUse()} extract_group_button_state={e_store.showExtractGroupButton} table_row_name={e_store.table_head.slice()} loading_state={e_store.loading_screen} checkBoxInput={(e)=>e_store.checkBoxInputHandler(e)} />
			)

	}

}

export default Extractor;
