import React, { Component } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"
import HomeTenant from "./components/homeTenant"
import HomeResident from "./components/homeResident"
import userCreationForm from "./components/userCreationForm"
import logInForm from "./components/logInForm"
import LogOut from "./components/logOut"
import LoggedInRoute from "./components/LoggedInRoute"
import LoggedInRouteTen from "./components/LoggedInRouteTen"
import ContractTenant from "./components/contractsTenant"
import BillsTenant from "./components/billsTenant"
import ScheduleTenant from "./components/scheduleTenant"
import ProfileTenant from "./components/profileTenant"
import ContractsResident from "./components/contractsResident"
import BillsResident from "./components/billsResident"
import ProfileResident from "./components/profileResident"
import addPropForm from "./components/addPropForm"
import rentForm from "./components/rentForm"
import checkLogIn from "./components/checkLogIn"
import ToDoApp from "./components/ToDoApp"

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={checkLogIn} />
                    <LoggedInRoute exact path="/logOut" component={LogOut} />
                    <Route exact path="/registerUser" component={userCreationForm} />
                    <Route exact path="/logInForm" component={logInForm} />
                    <LoggedInRouteTen exact path="/tenantHome" component={HomeTenant} />
                    <LoggedInRouteTen exact path="/tenantContracts" component={ContractTenant} />
                    <LoggedInRouteTen exact path="/tenantBills" component={BillsTenant} />
                    <LoggedInRouteTen exact path="/tenantSchedule" component={ScheduleTenant} />
                    <LoggedInRouteTen exact path="/tenantProfile" component={ProfileTenant} />
                    <LoggedInRoute exact path="/residentHome" component={HomeResident} />
                    <LoggedInRoute exact path="/residentContracts" component={ContractsResident} />
                    <LoggedInRoute exact path="/residentBills" component={BillsResident} />
                    <LoggedInRoute exact path="/residentProfile" component={ProfileResident} />
                    <LoggedInRoute exact path="/tenantAddPropForm" component={addPropForm} />
                    <LoggedInRoute exact path="/rentForm/" component={rentForm} />
                    <Route exact path="/ToDoApp" component={ToDoApp} />
                    <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>} />
                </Switch>
            </BrowserRouter>
        )
    }
}