import React, {Component} from 'react';
import $ from 'jquery';
import e_store from './extractor_store';
window.$ = window.jQuery = $;

class ExtractGroupModal extends Component{

	render(){
		$(()=>{
			$(this.cookie_modal).modal(this.props.modal_state);
			
		});
		return(
			<div className="modal fade" ref={input=>{this.cookie_modal = input}} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h5 className="modal-title" id="exampleModalLabel">Extract Progress</h5>
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div className="modal-body">
			        <div className="container">
			        	<div className="row">
			        		<div className="col-sm-12">
			        			<div className="progress">
			        				<div className={this.props.class_style} role="progressbar" aria-valuenow={this.props.percent} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.percent+'%'}}>{this.props.percent}%</div>
			        			</div>
			        		</div>
			        	</div>
			        </div>
			      </div>
			      <div className="modal-footer">
			        <button type="button" onClick={()=>this.props.closeModal()} className="btn btn-secondary" data-dismiss="modal">Close</button>
			        <button type="button" onClick={()=>this.props.submit()}  className="btn btn-primary">Save changes</button>
			      </div>
			    </div>
			  </div>
			</div>
			)
	}
}

export default ExtractGroupModal;