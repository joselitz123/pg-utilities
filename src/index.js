import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes';
import ModalGallery from './components/About/index';
import stores from './compiledStores';

class NoMatch extends Component{
  render(){
    return(<h1>No page matched</h1>)
  }
}

class RouteLayouts extends Component{

  render(){
    const {location} = this.props;
    return(
         <div>
          <Switch>
            {routes.map((route,index)=>{
              return <Route  key={index} exact={route.exact} path={route.path} component={route.component} />
            })}
            <Route component={()=><NoMatch />} />
          </Switch>
         </div>
      )
  }
}


class RenderedDisplay extends Component{
  render(){

    return(
      <Provider {...stores}>
        <Router>
          <Route component={RouteLayouts} />
        </Router>
      </Provider>
      )
  }
}


ReactDOM.render(<RenderedDisplay />, document.getElementById('root'));
registerServiceWorker();
