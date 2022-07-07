import React, {Component} from "react"
import NavBar from "./NavBarResidents"

import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class ProfileResident extends Component 
{
    constructor(props){
        super(props)

        this.state = {
            name: '',
            username: '',
            id: '',
            password: '',
            userType: 'resident',
            phoneNumber: '',
            mounted: false
        }

    }
    componentDidMount = () =>{
        axios.get(`${SERVER_HOST}/Users/resident`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {     
            if(res.data)
                if (res.data.errorMessage)
                    console.log(res.data.errorMessage)  
                else{
                    console.log(res.data)
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
    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="3"/>
                <div className="content-container">
                    <h1>RESIDENTS PROFILE PAGE</h1>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}