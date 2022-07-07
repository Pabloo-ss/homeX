import React, { Component } from "react"
import { Redirect, Link } from 'react-router-dom'


export default class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: this.props.selected
        }
    }
    render() {
        return (
            <div className="navbar-container">
                <div className="logo-container">
                    <img id="littleSizeLogo" src={require("../images/logo.png")} alt="" />
                </div>
                <div className="nav-items">
                    <Link className={this.props.selected == 0 ? "navBar-item-b" : "navBar-item"} to="/tenantHome">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/homeIcon.png")} alt="" />
                        </div>
                        <h2 id="homeText" className="menuText">Home</h2>
                    </Link>

                    <Link className={this.props.selected == 1 ? "navBar-item-b" : "navBar-item"} to="/tenantContracts">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/contractsIcon.png")} alt="" />
                        </div>
                        <h2 className="menuText">Contracts</h2>
                    </Link>

                    <Link className={this.props.selected == 2 ? "navBar-item-b" : "navBar-item"} to="/tenantBills">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/billsIcon.png")} alt="" />
                        </div>
                        <h2 id="billsText" className="menuText">Bills</h2>
                    </Link>

                    <Link className={this.props.selected == 3 ? "navBar-item-b" : "navBar-item"} to="/tenantSchedule">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/scheduleIcon.png")} alt="" />
                        </div>
                        <h2 className="menuText">Schedule</h2>
                    </Link>

                    <Link className={this.props.selected == 4 ? "navBar-item-b" : "navBar-item"} to="/tenantProfile">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/profileIcon.png")} alt="" />
                        </div>
                        <h2 id="profileText" className="menuText">Profile</h2>
                    </Link>

                    <Link className={this.props.selected == 5 ? "navBar-item-b" : "navBar-item"} to="/ToDoApp">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/to-do-list.png")} alt="" />
                        </div>
                        <h2 id="profileText" className="menuText">ToDoApp</h2>
                    </Link>
                </div>
                <Link to="/logOut" className="logout">
                    <div className="logout-container">
                        <div className="navBarItemIcon">
                            <img className="navBarIcon" src={require("../images/logOutIcon.png")} alt="" />
                        </div>
                        <h2 className="menuText">Log Out</h2>
                    </div>
                </Link>
            </div>
        )
    }
}