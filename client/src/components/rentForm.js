import React, {Component} from "react"
import axios from "axios"
import {Redirect,Link} from "react-router-dom"
import NavBar from "./NavBarResidents"

import {SERVER_HOST} from "../config/global_constants"
import MonthYearPicker from 'react-month-year-picker';


export default class rentForm extends Component{

    constructor(props) 
    {
        super(props)

        this.state = {
            user: null,
            month: null,
            year: null,
            expireYear: null,
            expireMonth: null,
            resident: localStorage.email,
            currentResidentName: '',
            currentResidentID: '',
            redirect:false,
            errorMessage: '',
            mounted: false,
            finalResidents: [],
        }
    }

    componentDidMount()
    {

        let now = new Date();
        let current
        if (now.getMonth() == 11) {
            current = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }

        this.setState({month: current.getMonth() + 1, year: current.getFullYear(), expireMonth: current.getMonth() + 2, expireYear: current.getFullYear()})

        axios.get(`${SERVER_HOST}/Users/resident`, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
            .then(res => 
            {
                if(res.data)
                {            
                    if (res.data.errorMessage)
                    {
                        console.log(res.data.errorMessage)    
                    }
                    else
                    {      
                        let residents = this.state.finalResidents

                        residents[0] = {
                            name: res.data.user.name,
                            id: res.data.user.id
                        }
                        
                        this.setState({finalResidents: residents, user: res.data,mounted: true})
                        
                    }   
                }
                else
                {
                    console.log("Record not found")
                }
            })

    }


    validateDate() {
        if( this.state.month != 'no'){
            if(this.state.year != 'no'){
                var d = new Date(this.state.year, this.state.month-1, 1)
                if(d > Date.now())
                    return true
            }
        }
        return false
    }

    validateExpireDate() {
        if( this.state.expireMonth != 'no'){
            if(this.state.expireYear != 'no'){
                var ed = new Date(this.state.expireYear, this.state.expireMonth-1, 28)
                var d = new Date(this.state.year, this.state.month, 1)
                if(ed > d)
                    return true
            }
        }
        return false
    }

    validateResidents() {
        if(this.state.finalResidents.length > 0){
            return true
        }else{
            return false
        }
    }

    validation(){
        return {
            date: this.validateDate(),
            expireDate: this.validateExpireDate(),
            residents: this.validateResidents()
        }
    }

    validateName(){
        if(this.state.currentResidentName === ''){
            return false
        }else{
            return true
        }
    }

    validateID(){
        if(this.state.currentResidentID === ''){
            return false
        }else{
            return true
        }
    }

    residentValidation(){
        return {
            name: this.validateName(),
            id: this.validateID(),
        }
    }


    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})

    }

    sendRequest = e => {

        let formData = new FormData()  
        formData.append("date", new Date(this.state.year, this.state.month-1, 1))
        formData.append("expireDate", new Date(this.state.expireYear, this.state.expireMonth-1, 28))
        formData.append("moneyAmount", this.props.location.state.price) 
        formData.append("tenant", this.props.location.state.tenant) 
        formData.append("monthlyDeadLine", 1)
        formData.append("resident", this.state.resident)

        //for residents
        for(let i = 0; i < this.state.finalResidents.length; i++)
        {
            formData.append("residents", JSON.stringify(this.state.finalResidents[i]))
        }

        axios.post(`${SERVER_HOST}/Properties/rentProperty/${this.props.location.state._id}`, formData, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
        .then(res => 
        {   
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {   
                    console.log("Record added")
                    this.setState({redirect: !this.state.redirect})
                } 
            }
            else
            {
                console.log("Record not added")
            }
        }).catch(err =>{
            console.log("err:" + err.response.data) 
        })
    }

    cancelProperty = e => {
        this.setState({redirect: !this.state.redirect})
    }

    addResident = e => {
        let residents = this.state.finalResidents

        let resident = {
            name: this.state.currentResidentName,
            id: this.state.currentResidentID,
        }

        residents.push(resident)

        this.setState({finalResidents: residents, currentResidentName: '', currentResidentID: ''})
    }

    render() 
    {   
        //errors
        let validDate = <div className="error"> Enter a valid date.</div>
        let validExpireDate = <div className="error"> Enter a valid date.</div>

        //validation
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        const residentInputsState = this.residentValidation()
        const residentInputsAreAllValid = Object.keys(residentInputsState).every(index => residentInputsState[index]) 

        return (       
            <div className="web-container"> 
                {this.state.redirect ? <Redirect to="/residentHome"/> : null}
                <NavBar selected="0"/>
                {this.state.mounted ? 
                <div className="content-container">
                    <div className="rent-form">
                        <h1>Rent Form</h1>
                        <div className="fields-container">
                            <div className="dates-container">
                                <div className="date-item">
                                    <MonthYearPicker
                                        caption="Select a starting year and month."
                                        selectedMonth={this.state.month}
                                        selectedYear={this.state.year}
                                        minYear={new Date().getFullYear()}
                                        maxYear={2030}
                                        onChangeYear={year => this.setState({ year: year })}
                                        onChangeMonth={month => this.setState({ month: month })}
                                        />
                                    {formInputsState.date ? "" : validDate}
                                </div>
                                <div className="date-item">
                                    <MonthYearPicker
                                        caption="Select an ending year and month."
                                        selectedMonth={this.state.expireMonth}
                                        selectedYear={this.state.expireYear}
                                        minYear={new Date().getFullYear()}
                                        maxYear={2030}
                                        onChangeYear={year => this.setState({ expireYear: year })}
                                        onChangeMonth={month => this.setState({ expireMonth: month })}
                                        />
                                    {formInputsState.expireDate ? "" : validExpireDate}
                                </div>
                            </div>
                            <div className="residents-container">
                                {/* formed by a add resident "form" and a table of residents*/}
                                <div className="inputs">
                                    <input className = {"form-control"}
                                        id="currentResidentName" 
                                        type="text" 
                                        name="currentResidentName" placeholder="Resident's full name" 
                                        onChange={this.handleChange} ref={input => { this.inputToFocus = input }}/>
                                    <input className = {"form-control"}
                                        id="currentResidentID" 
                                        type="text" 
                                        name="currentResidentID" placeholder="Resident's ID" 
                                        onChange={this.handleChange}/>
                                    <input type="button" className="blue-button" value="Add resident" disabled = {!residentInputsAreAllValid} onClick={this.addResident}/>
                                </div>
                                <div className="residentsTable">
                                    <table>
                                        <thead>
                                            <tr><th>Resident's name</th><th>Resident's ID</th></tr>
                                        </thead>
                                        <tbody>
                                            {this.state.finalResidents.map((resident, index) => <tr key={index}><td>{resident.name}</td><td> {resident.id}</td></tr> )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="button-container">
                            <input type="button" className="green-button" value="Submit" disabled = {!inputsAreAllValid} onClick={this.sendRequest}/>
                            <Link className="red-button" to="/residentContracts"> Cancel Rental</Link>
                        </div> 
                    </div>             
            </div> : null}
                
            </div>
        )
    }
}