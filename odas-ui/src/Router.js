import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
// Components
import Header from "./Components/Header";
import Main from "./Pages/Main";
import QueryData from "./Pages/QueryData";
import UploadData from "./Pages/UploadData";
import Documentation from "./Pages/Documentation";
import Register from "./Pages/Register";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "./Layout/Main.css";
import Dashboard from "./Pages/Dashboard";

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Header />
                <Switch>
                    <Route path={"/"} exact component={Main} />
                    <Route path={"/query"} component={QueryData} />
                    <Route path={"/upload"} component={UploadData} />
                    <Route path={"/documentation"} component={Documentation} />
                    <Route path={"/user-dashboard"} component={Dashboard} />
                    <Route path={"/register"} component={Register} />
                </Switch>
            </Router>
        );
    }
}