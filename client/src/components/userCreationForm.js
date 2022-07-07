import React, { Component } from "react"

import { Redirect, Link } from 'react-router-dom'

import axios from "axios"

import { ACCESS_LEVEL_GUEST, SERVER_HOST } from "../config/global_constants"

export default class userForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'Tenant',
            name: '',
            id: '',
            phoneNumber: '',
            redirect: false,
            userExitsError: false,
            errorMessage: ''
        }

    }

    componentDidMount() {
        this.inputToFocus.focus()
    }

    validateUserName() {
        if (this.state.userName === "") {
            return false
        } else {
            return true
        }
    }

    validateName() {
        if (this.state.name === "") {
            return false
        } else {
            return true
        }
    }

    validateId() {
        if (this.state.id === "") {
            return false
        } else {
            return true
        }
    }

    validatPhoneNumber() {
        if (this.state.id === "") {
            return false
        } else {
            return true
        }
    }

    validateEmail() {
        //this is from internet
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email).toLowerCase());
    }

    validatePassword() {
        //we can make these more complex using ifs.
        if (this.state.password.length < 10 || !/[A-Z]/.test(this.state.password) || !/[a-z]/.test(this.state.password) || !/[0-9]/.test(this.state.password)
            || !/[£!#€$%^&*]/.test(this.state.password)) {
            return false
        } else {
            return true
        }
    }

    validateConfirmPassword() {
        //if the states of passwords are the same, it means its all ok
        if (this.state.confirmPassword === "") {
            return false
        }
        if (this.state.password === this.state.confirmPassword)
            return true
        else
            return false
    }

    validation() {
        //creamos un objeto 
        return {
            userName: this.validateUserName(),
            email: this.validateEmail(),
            password: this.validatePassword(),
            confirmPassword: this.validateConfirmPassword(),
            name: this.validateName(),
            id: this.validateId(),
            phoneNumber: this.validatPhoneNumber()
        }

    }


    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value })

    }

    addUser = e => {

        //clientSide validation
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|("."))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

        if (!this.state.email.match(mailPattern)) {
            console.log('Email must be valid')
        } else if (!this.state.password.match(passwordPattern)) {
            console.log('Password must have at least 6 characters, 1 number and 1 especial character.')
        } else if (!this.state.confirmPassword.match(this.state.password)) {
            console.log('Passwords must match.')
        } else {
            //we encode the pass for cases with especial character
            let encodedPass = encodeURIComponent(this.state.password, "UTF-8")

            //we create the formData that will be passed to the server
            var bodyFormData = new FormData();
            bodyFormData.append('userName', this.state.userName)
            bodyFormData.append('email', this.state.email)
            bodyFormData.append('userType', this.state.userType)
            bodyFormData.append('id', this.state.id)
            bodyFormData.append('phoneNumber', this.state.phoneNumber)
            bodyFormData.append('password', encodedPass)
            bodyFormData.append('name', this.state.name)

            axios({
                method: "post",
                url: `${SERVER_HOST}/Users/register`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(res => {
                //handle success
                localStorage.email = res.data.email
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token

                this.setState({ redirect: !this.state.redirect })
            }).catch(err => {
                //handle error
                localStorage.email = 'GUEST'
                localStorage.accessLevel = ACCESS_LEVEL_GUEST
                this.setState({ userExitsError: !this.state.userExitsError, errorMessage: err.response.data })
            });
        }
    }

    cancelUser = e => {
        this.setState({ redirect: !this.state.redirect })
    }

    render() {

        let errorList = []
        if (this.state.password.length < 10) {
            errorList.push({ id: 1, msg: "Password must be 10 digits long." })
        }
        if (!/[0-9]/.test(this.state.password)) {
            errorList.push({ id: 2, msg: "Password must contain a digit." })
        }
        if (!/[A-Z]/.test(this.state.password)) {
            errorList.push({ id: 3, msg: "Password must contain an uppercase." })
        }
        if (!/[a-z]/.test(this.state.password)) {
            errorList.push({ id: 4, msg: "Password must contain an lowercase." })
        }
        if (!/[£!#€$%^&*]/.test(this.state.password)) {
            errorList.push({ id: 5, msg: "Password must contain a special digit [£!#€$%^&*]." })
        }

        //errors
        let nameEmpty = <div className="error">Enter a name<br /></div>
        let emailErrorMessage = <div className="error">Enter a valid email<br /></div>
        let emailEmpty = <div className="error">Email is empty.<br /></div>
        let passwordErrorMessge = <div className="error"><ul> {errorList.map(error => <li key={error.id}> {error.msg} </li>)}</ul></div>
        let passwordConfirmErrorMessge = <div className="error">Passwords doesn't match<br /></div>
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index])

        return (

            <div id="registerWeb" className="web-container">
                {this.state.redirect ? <Redirect to="/" /> : null}
                <div id="registerLogoContainer" className="logo-container">

                    <img className="registerLogo" src={require("../images/logo.png")} alt="" />

                </div>
                <div className="register-form-container">
                    {this.state.userExitsError ? <div className="errorDiv">{this.state.errorMessage}</div> : null}

                    <div className="item-container">
                        <input className={"form-control" ? "" : "error"}
                            id="userName"
                            type="text"
                            name="userName" placeholder="User Name"
                            onChange={this.handleChange} ref={input => { this.inputToFocus = input }} />
                    </div>
                    {formInputsState.userName ? "" : nameEmpty}

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="password"
                                type="password"
                                name="password" placeholder="Password"
                                onChange={this.handleChange} />
                            {formInputsState.password ? "" : passwordErrorMessge}
                        </div>

                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword" placeholder="Confirm password"
                                onChange={this.handleChange} />
                            {formInputsState.confirmPassword ? "" : passwordConfirmErrorMessge}<br />
                        </div>
                    </div>

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="name"
                                type="text"
                                name="name" placeholder="User's full name"
                                onChange={this.handleChange} />
                        </div>

                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="id"
                                type="text"
                                name="id" placeholder="User's ID"
                                onChange={this.handleChange} />
                        </div>
                    </div>

                    <div className="item-container">
                        <label className="user-type--labeled">
                            <p>Type:</p>
                            <div className="customSelect">
                                <select className="form-control" name="userType" defaultValue="Tenant" onChange={this.handleChange}>
                                    <option value="Tenant">Tenant</option>
                                    <option value="Resident">Resident</option>
                                </select>
                            </div>
                        </label>
                    </div>

                    <div className="item-container">
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="email"
                                type="text"
                                name="email" placeholder="Email"
                                onChange={this.handleChange} />
                            {this.state.email === "" ? emailEmpty : formInputsState.email ? "" : emailErrorMessage}
                        </div>
                        <div className="sub-item-container">
                            <input className={"form-control" ? "" : "error"}
                                id="phoneNumber"
                                type="text"
                                name="phoneNumber" placeholder="User's phone number"
                                onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="register-buttons">
                        <div>
                            <Link className="red-button" to="/LogInForm"> Cancel </Link>
                        </div>
                        <div>
                            <input type="button" className="green-button" value="Add User" disabled={!inputsAreAllValid} onClick={this.addUser} />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}