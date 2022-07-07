import React, {Component} from "react"
import {Redirect, Link} from 'react-router-dom'
import NavBar from "./NavBar"

export default class ScheduleTenant extends Component 
{
    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="3"/>
                <div className="content-container">
                    <h1>TENANTS SCHEDULE PAGE</h1>
                </div>
            </div>

        )
    }
}
