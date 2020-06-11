import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterForm from "./components/entrance/RegisterForm";
import LoginForm from "./components/entrance/LoginForm";
import { history } from "./helpers/history";
// import Router from "react-router-dom/es/Router";
import {BrowserRouter as Router} from "react-router-dom";
import Route from "react-router-dom/es/Route";
import { connect, Provider } from "react-redux";
import Home from "./components/home/Home";
import Navigation from "./components/navigation/Navigation";

import PreferenceBar from "./components/home/PreferenceBar";

const initialState = {
  route: 'login',
  isSignedIn: false
}


class App extends React.Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
      this.props.clearMessage();
    })
    this.state = initialState;
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    console.log(this.state);
    const { message } = this.props;
    const { isSignedIn, route } = this.state;
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-8 col-sm-offset-2">
            {message && <div className={'alert ' + message.type}>{message.message}</div>}
            <switch>
              <Router history={history}>
                {/* <Route path="/login" component={LoginForm}/>
                <Route path="/register" component={RegisterForm}/> */}
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                {route === 'home'
                  ? <div>
                    <PreferenceBar/>
                    <Home />
                  </div>
                  : (
                    route === 'login'
                      ? <LoginForm onRouteChange={this.onRouteChange} />
                      // ? <Route path= "/" render={() => (<LoginForm onRouteChange={this.onRouteChange}/>)}/>
                      : (route === 'signout'
                        ? <LoginForm onRouteChange={this.onRouteChange}/>
                        // ? <Route path= "/" render={() => (<LoginForm onRouteChange={this.onRouteChange}/>)}/>
                        // : <Route path= "/register" render={()=> (<RegisterForm onRouteChange={this.onRouteChange}/>)}/> )
                        // 这里好像和route有冲突 没法用cancel和register跳转到合适的位置
                      : <RegisterForm onRouteChange={this.onRouteChange}/> )
                  )
                }
              </Router> 
            </switch>
          </div>
        </div>
      </div>

    )
  }
}





// render() {
//     const {message, route, isSignedIn,} = this.props;
//     return (
//       <div className="App">

//         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
//         { route === 'home'
//           ? <div>
//               <Home/>
//             </div>
//           : (
//              route === 'login'
//              ? <LoginForm  onRouteChange={this.onRouteChange}/>
//              : <RegisterForm  onRouteChange={this.onRouteChange}/>
//             )
//         }
//       </div>
//     );
//   }
// }

const mapState = (state) => {
  return { message: state.message };
};

const mapDispatch = (dispatch) => {
  return {
    clearMessage: () => {
      dispatch({ type: "CLEAR_MESSAGE" })
    }
  };
};

export default connect(mapState, mapDispatch)(App);