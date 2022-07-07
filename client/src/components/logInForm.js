import React, {Component} from "react"

import {Redirect, Link} from 'react-router-dom'

import axios from "axios"

import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_GUEST} from "../config/global_constants"

export default class logInForm extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = {
            email: '',
            password: '',
            redirectTenant:false,
            redirectResident:false,
            logInError: false,
            errorMessage: ''
        }

    }

    componentDidMount(){
        localStorage.clear()
        localStorage.email = 'GUEST'
        localStorage.accessLevel = ACCESS_LEVEL_GUEST
    }

    validateEmail() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email).toLowerCase());
    }
    
    validatePassword() {
        if(this.state.password){
                return true
            }else{
                return false
            }
    }

    validation(){
        return {
            email: this.validateEmail(),
            password: this.validatePassword()
        }

    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    logInUser = e => {  
        localStorage.email = "GUEST"
        localStorage.accessLevel = ACCESS_LEVEL_GUEST 
        let encodedPass = encodeURIComponent(this.state.password, "UTF-8")

        var bodyFormData = new FormData();
        bodyFormData.append('email', this.state.email)
        bodyFormData.append('password', encodedPass)

        axios({
            method: "post",
            url: `${SERVER_HOST}/Users/login`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => {
            //handle success
            localStorage.email = res.data.email
            localStorage.accessLevel = res.data.accessLevel
            localStorage.token = res.data.token

            if(res.data.accessLevel === ACCESS_LEVEL_ADMIN){
                this.setState({redirectTenant:true})
            }else{
                this.setState({redirectResident:true})
            }
        }).catch(err => {
            //handle error
            localStorage.email = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            this.setState({logInError: true, errorMessage: 'Error on login, credentials does not match.'})
        });
    }

    cancelUser = e => {

        this.setState({redirect: !this.state.redirect})
    }

    render() 
    {   

        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return (      
            
            <div className="web-container">
                {this.state.redirectTenant ? <Redirect to="/tenantHome"/> : null}
                {this.state.redirectResident ? <Redirect to="/residentHome"/> : null}
                <div className="login-container">
                    <div className="logo-container">
                        <img id="bigSizeLogo" src={require("../images/logo.png")} alt=""/>
                    </div>

                    <div className="form-container">
                        {this.state.logInError ? <div className="error">{this.state.errorMessage}</div> : null}
                        <input className="form-control" id="email" type="text" name="email" placeholder="Email" onChange={this.handleChange}/><br/>
                        <input className="form-control" id="password" type="password" name="password"  placeholder="Password" onChange={this.handleChange}/><br/>  
                    </div>

                    <div className="button-container">
                        <div className="left-button">
                            <Link id="registerButton" className="blue-button" to="/registerUser"> Register New User </Link>
                        </div>
                        <div className="right-button">
                            <input id="loginButton" type="button" className="green-button" value="Log In" disabled = {!inputsAreAllValid} onClick={this.logInUser}/>
                        </div> 
                    </div>
                </div>
            </div> 
        )
    }
}