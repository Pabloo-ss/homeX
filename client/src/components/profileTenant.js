import React, {Component} from "react"
import {Redirect, Link} from 'react-router-dom'
import NavBar from "./NavBar"

import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"


export default class ProfileTenant extends Component 
{
    constructor(props){
        super(props)

        this.state = {
            name: '',
            username: '',
            id: '',
            password: '',
            userType: 'tenant',
            phoneNumber: '',
            mounted: false,
            redirect: false
        }

    }
    componentDidMount = () =>{
        axios.get(`${SERVER_HOST}/Users/tenant`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else{
                    this.setState({name: res.data.user.name})
                    this.setState({username: res.data.user.username})
                    this.setState({id: res.data.user.id})
                    this.setState({password: res.data.user.password})
                    this.setState({phoneNumber: res.data.user.phoneNumber})
                    this.setState({mounted: true})
                }  

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })         
    }

    updateProfile = () =>{
        const data = {name: this.state.name, username: this.state.username, id: this.state.id, password: this.state.password, userType: this.state.userType, phoneNumber: this.state.phoneNumber} 
        axios.put(`${SERVER_HOST}/Users/profile`, data, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)    

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })  
    }

    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    allFilled = () =>{
        if(this.state.name !== '' && this.state.username !== '' && this.state.password !== '' && this.state.id !== '' && this.state.phoneNumber !== '')
            return false
        else
            return true
    }

    loginAsResident = () =>{
        axios.put(`${SERVER_HOST}/Users/profile/switch`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                    
            this.setState({redirect: true})

        }).catch(error =>{
            console.log("err:" + error.response.data)
        })  
    }

    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="4"/>
                {this.state.redirect? <Redirect to="/homeResident"/> : null}
                <div className="content-container">
                    <h1>TENANTS PROFILE PAGE</h1>
                    <div className="profile"> 
                        <div className="item-container">
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="username"
                                    type="text"
                                    name="username" placeholder="Username"
                                    value={this.state.username}
                                    onChange={this.handleChange} />
                            </div>

                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="password"
                                    type="password"
                                    name="password" placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange} />
                            </div>                         
                        </div>
                        <div className="item-container">
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="name"
                                    type="text"
                                    name="name" placeholder="User's full name"
                                    value={this.state.name}
                                    onChange={this.handleChange} />
                            </div>

                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="id"
                                    type="text"
                                    name="id" placeholder="User's ID"
                                    value={this.state.id}
                                    onChange={this.handleChange} />
                            </div>
                            <div className="sub-item-container">
                                <input className={"form-control" ? "" : "error"}
                                    id="phone"
                                    type="text"
                                    name="phone" placeholder="Phone number"
                                    value={this.state.phoneNumber}
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <div id="buttons">
                            <input type="button" className="green-button" value="Update" disabled={this.allFilled()} onClick={this.updateProfile}/>
                            <input type="button" className="blue-button" value="Log in as User" onClick={this.loginAsResident}/>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
