import { observable, computed, action, autorun } from 'mobx';
import React, {Component} from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert2';
window.$ = window.jQuery = $;


class ExtractorStore {

	/**
	 * Executes the prerequisites before the user can use the extractor
	 */
	@action executeUponMount(){
		if (typeof window != 'undefined' && window.location.pathname == '/extractor') {
			$(()=>{

				this.createTableElementDOM();
				this.InstantiateDataTablesAPI();
				this.sessionStorageCheck(); //CHECK SESSION STORAGE ON THE FIRST RUN MAKE SURE THE CONNECTION WITH GROUP GENIE
			});
		}
	}


	@observable search_input = '';

	@observable search_filter = ['&attr%5B%5D=uid', '&attr%5B%5D=extshortname','&attr%5B%5D=employeetype', '&attr%5B%5D=extcountry'];

	@observable raw_data = [];

	@observable loading_screen = 'display_hidden';

	//TABLE THEAD TITLES
	@observable table_head = [{title: 'Name'},
							 {title: 'T-number'},
							 {title: 'Shortname'},
							 {title: 'Employee Type'},
							 {title: 'Region'}
								];

	//DATA TO BE DISPLAYED ON THE FRONTEND
	@observable view_data = [];

	//TABLE INSTANCE FROM THE VIEW
	table_instance = '';

	//DATA TABLES INSTANCE
	data_table_instance = '';

	@observable modals = {
		extract_progress: {
			visibility: 'hide',
			percent: 0,
			style: '',
		}
	}


	@observable forms = {
		cookie_getter: {
			input: '',
			error: ''
		}
	}

	//array values from the groups to be extracted coming from the user's groups
	@observable group_filter_field = [];

	//SEARCH INPUT CHANGES HANDLER
	@action searchInput(input){
		this.search_input = input;
	}

	//SENDS REQUEST T0 EXTRACT THE SEARCHED GROUP TO THE GROUP GENIE
	@action searchGroup(e){
		e.preventDefault();
		const filter_keys = this.search_filter.reduce((all_filter,filter)=>{
			return all_filter+filter;
		},'');
		this.loading_screen = 'loading_data fadeIn animated';
		axios.post('/api/extractor', {
			group: this.search_input,
			filter: filter_keys,
			session: window.sessionStorage.getItem('session'),
		})
		.then((res)=>{
			if (res.data.success == true) {
				this.raw_data = res.data.data;
				this.normalizeData();
				this.table_head.slice().map((data, index)=>{
					if (data.title == 'Groups') {
						this.table_head.splice(index, 1);
					}
				})
				this.data_table_instance.destroy(true);//DESTROY DATA TABLE INSTANCE AND ITS DOM ELEMENT
				this.createTableElementDOM(); //RECREATE THE TABLE TO THE DOM
				this.InstantiateDataTablesAPI(); //INSTANTIATE AGAIN THE DATA TABLE
				this.loading_screen = 'loading_data fadeOut animated';
				window.setTimeout(()=>{
					this.loading_screen = 'display_hidden';
				},800);	
			}else{
				console.log(data);
			}
			
		})
	}

	//FORMATS THE RAW DATA TO BE DISPLAYABLE FOR THE FRONT END
	@action normalizeData(){
		if (this.raw_data.length != 0) {
			const data_list = $(this.raw_data).find('font table table tbody tr');
			const row_data = [];
			data_list.each((index, row)=>{
					const row_length = $(row).find('td').length;
					console.log(index > 1 && row_length == this.search_filter.slice().length);
					if (index > 1 && row_length == this.search_filter.slice().length+1) {
						row_data.push($(row).find('td'));
					}
				
			});
			
			const data = row_data.reduce((total_row,row,ind)=>{ //REDUCES THE DATA TO ARRAY
				let division_data = [];

					$(row).find('font').each((index, division)=>{//TRAVERSE THE ELEMENT COMING FROM GROUP GENIE ELEMENTS
						if (index > 0) {
							if ($(division).text() == '') {
								division_data.push('');	
							}else{
								division_data.push($(division).text());
							}
						}
					});
				return  [division_data,...total_row];
			},[]);
			
			this.view_data = data;
		}
	}

	//CHECK BOX INPUT HANDLER
	@action checkBoxInputHandler(event){
		if (event.target.checked == true) {
			this.search_filter.push(event.target.value);
			this.table_head.push({title: event.target.name});
		}else{
			const index = this.search_filter.findIndex(filter=>{return filter == event.target.value});
			const name_index = this.table_head.findIndex(name=>{return name.title == event.target.name});
			this.search_filter.splice(index, 1);
			this.table_head.splice(name_index, 1);
		}
		
	}	

	//INSTANTIATE THE DATA TABLES API
	@action InstantiateDataTablesAPI(){
		this.data_table_instance = $('#table_data').DataTable({
			data: this.view_data,
			columns: this.table_head,
			dom: 'Bfrtip',
			buttons: ['copy',{
				extend: 'excel',
				title: this.search_input,
			}],
		});

		this.data_table_instance.columns.adjust().draw();
	}

	//APPENDS A TABLE ELEMENT TO THE BROWSER DOM USING JQUERY
	@action createTableElementDOM(){
			$('.space').after('<div class="col-sm-12"><table id="table_data" class="table table-striped table-bordered"></table></div>');
	}

	//CHECKS THE SESSION STORAGE FOR THE STORED GROUP GENIE COOKIE SESSION
	@action sessionStorageCheck(){
		const modals = this.modals;
		const session = window.sessionStorage.getItem('session');
		if (window.sessionStorage.getItem('session') == null) {
			this.cookieGetterSwalModal(); //ASK TO USER FOR GROUP GENIE COOKIE THROUGH SWAL MODAL
		}else{			
			this.testCookieSession(session);
		}
	}


	//ASK TO USER FOR GROUP GENIE COOKIE THROUGH SWAL MODAL
	@action cookieGetterSwalModal(cookie){
		swal({
			  input: 'textarea',
			  inputPlaceholder: 'Paste the group genie cookie session here',
			  showCancelButton: false,
			  allowOutsideClick: false,
			  confirmButtonText: 'Submit',
			  inputValidator: (cookie)=>{
			  	return new Promise(resolve=>{
			  		if (cookie.length == 0) {
			  			resolve(`This field can't be empty`);
			  		}else{
			  			resolve();
			  		}
			  	})
			  },
			  showLoaderOnConfirm: true,
			  preConfirm: (cookie)=>{
			  	return new Promise((resolve)=>{
			  		swal.disableInput();
			  		this.testCookieSession(cookie)
			  		.then((result)=>{
			  			if (result == true) {
				  			resolve();
				  		}else if(result == false){
				  			swal.enableInput();
				  			swal.showValidationError(`Can't establish a connection using the cookie entered.`);
				  			swal.disableLoading();
				  		}
			  		})
			  	});
			  }
			})
			.then(()=>{
				 swal({
				      type: 'success',
				      title: 'Success!',
				      html: 'Connection has been established with Group Genie'
				    })
			})
	}

	//TESTS THE COOKIE SESSION THAT IS PROVIDED WHEN CALLED
	@action testCookieSession(cookie){
		return axios.get('/api/extractor', {
				params: {
					session: cookie,
				}
			})
			.then((res)=>{
				if (res.data.success == false) {
					if (window.sessionStorage.getItem('session') != null) { //REMOVES THE SESSION AS IT IS ALREADY EXPIRED
						window.sessionStorage.removeItem('session');	
						this.sessionStorageCheck();
					}else{
						return false;
					}
					
				}else{
					window.sessionStorage.setItem('session',cookie);
					return true;
				}
			});
	}


	//TOGGLES WHETHER TO SHOW THE EXTRACT WITH GROUP BUTTON FROM THE VIEW
	@computed get showExtractGroupButton(){
		if (this.view_data.length != 0) {
			return true;
		}else{
			return false;
		}
	}

	//CHANGES THE COLOR OF THE PROGRESS BAR DEPENDING ON THE PERCENTAGE OF THE PROGRESS
	@computed get progressBarColorCodeComputation(){
		const progress_modal = this.modals.extract_progress;
		switch (true) {
			case (progress_modal.percent < 25):
				return 'progress-bar progress-bar-striped progress-bar-animated bg-danger'
				break;
			case (progress_modal.percent < 50):
				return 'progress-bar progress-bar-striped progress-bar-animated bg-warning'
				break;
			case (progress_modal.percent < 75):
				return 'progress-bar progress-bar-striped progress-bar-animated bg-info'
				break;
			case (progress_modal.percent < 100):
				return 'progress-bar progress-bar-striped progress-bar-animated'
				break;
			case (progress_modal.percent == 100):
				return 'progress-bar progress-bar-striped bg-success';
				break;
			default:
				// statements_def
				break;
		}
	}

	//GETS THE FILTERS TO USED FOR TRAVERSING THE DATA USING MODAL SWAL
	@action getFilterstoUse(){
		swal({
		  title: 'Group name patterns to filter',
		  input: 'textarea',
		  inputPlaceholder: 'Type the pattern name to extract. kindly separate by using comma(,)',
		  showCancelButton: true
		}).then((result)=>{//BUILD THE REGEX FILTER TO BE USED			
			const value = result.value.replace(/\s+/, "");//gets the value from the input and converts to it's real value
			const filters = value.toString().split(",");

			const fi_filter = filters.reduce((total, current)=>{

				let sub_filter = '';
				if (/&/.test(current) == true) {

					const splt_filters = current.toString().split("&");

					const cmbnd_filters = splt_filters.reduce((ttl, crrnt)=>{

						if (ttl == '') {

							return ttl+=crrnt;

						}else{

							return ttl+=`.*`+crrnt;

						}

					}, '');

					sub_filter = cmbnd_filters;

				}else{

					sub_filter = current;

				}

				return [...total,sub_filter]

			},[]) // UNDER TEST

			let regex_filter = '';
			fi_filter.map((filter, index)=>{

				if (filters.length - 1 == index) {

					regex_filter+=filter;

				}else{

					regex_filter+=filter+'|';	

				}
				
			});

			console.log(regex_filter);
			regex_filter = new RegExp(regex_filter, "i");
			this.extractWithUsersGroup(regex_filter);
		});
	}

	testdata = '';
	//EXTRACT AND FILTER THE GROUPS THAT USER HAVE ACCESS
	@action extractWithUsersGroup(filter){

		const result = this.table_head.findIndex((title)=>{//GET THE INDEX OF THE T-NUMBER BEFORE TRAVERSING THE DATA
			return title.title == 'T-number';
		});

		const session = window.sessionStorage.getItem('session');
		const progress_modal = this.modals.extract_progress;
		progress_modal.visibility = 'show';
		let total_processed = 0;
		this.view_data.slice().map((user, index)=>{//RUN A REQUEST FOR EACH TNUMBERS ON THE ARRAY OF THE VIEW DATA
			axios.post('/api/extractor',{
			session: session,
			tnumber: user[result],
			})
			.then((res)=>{
				const groups = $(res.data.data).find('font table table tbody tr');//GET THE SPECIFIC LOCATION OF THE DATA NEEDED FROM THE DOM
				const raw_data = [];
				$(groups).each((count, group)=>{
					const selected_data = $(group).find('td:nth-child(1) a').text();//SELECT AND GET THE DATA FROM EACH ELEMENT OF THE DOM
					if (filter.test(selected_data)) {
						raw_data.push(selected_data);	
					}
				});
				this.view_data.slice()[index].push(raw_data); //PUSHES THE GATHERED GROUPS FOR EACH TNUMBERS ONE BY ONE TO ITS RESPECTIVE TNUMBERS THAT IS RELATED TO IT
				total_processed++;
				const percent = (total_processed * 100) / this.view_data.length;
				progress_modal.percent = Math.round(percent);
				if (total_processed == this.view_data.length) {
					this.reconstructDataTablesAPI();
					progress_modal.visibility = 'hide';
				}
			});

		});
	}

	//RECONSTRUCT THE WHOLE DATA TABLES TO INSERT THE GROUP COLUMN AND ITS DATA TO THE TABLE IN THE DOM
	@action reconstructDataTablesAPI(){

		this.table_head.push({title: 'Groups'});
		this.data_table_instance.destroy(true);
		this.createTableElementDOM();
		this.instantiateDataTablesAPIwithNewConfigration();
	}

	//INSTANTIATE THE DATA TABLES API FOR THE THE ADDED GROUP COLUMN AND CONFIGURATION
	@action instantiateDataTablesAPIwithNewConfigration(){
		const self = this;
		this.data_table_instance = $('#table_data').DataTable({
			data: this.view_data.slice(),
			columnDefs: [{
							render: function(groups){//reorganize the column data
								let output = '';
								groups.slice().map((group,index)=>{
									if (index+1 == groups.slice().length) {
										output+=`${group}`;	
									}else{
										output+=`${group}<br />`;	
									}
									
								});	
								return output;
							},
							targets: self.table_head.slice().length-1
						}],
			columns: this.table_head.slice(),
			dom: 'Bfrtip',
			buttons: ['copy',{
				extend: 'excel',
				title: this.search_input,
			}],
			lengthMenu: [[1000]]
		});

		this.data_table_instance.columns.adjust().draw();
	}


}


const e_store = window.e_store = new ExtractorStore;

export default e_store;

autorun(()=>{
	
})