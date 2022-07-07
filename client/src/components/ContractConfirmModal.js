import React, {Component} from "react"
import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class ContractConfirmModal extends Component{ 

    constructor(props) 
    {
        super(props)

        this.state = {contract: this.props.contract,
                      property: this.props.property,
                      pictures: [],
                      mounted: false,}
    }

    componentDidMount() 
    {   
        this.setState({mounted: true})
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
                var d = new Date(this.state.year, this.state.month-1, 1)
                if(ed > d)
                    return true
            }
        }
        return false
    }

    validateResidents() {
        if(this.state.residents != '')
            return true
        
        return false
    }

    validation(){
        return {
            date: this.validateDate(),
            expireDate: this.validateExpireDate(),
            residents: this.validateResidents()
        }

    }


    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})

    }

    handleDeadline = e => {
        let dataContract = this.state.contract

        dataContract.monthlyDeadLine = parseInt(e.target.value)

        this.setState({contract: dataContract})
    }

    handleFinalPrice = e => {
        let dataProp = this.state.property

        dataProp.price = parseInt(e.target.value)

        this.setState({property: dataProp})
    }

    acceptContract = e => {
        //server cll to accept the contract
        let formData = new FormData()  
        formData.append("date", new Date(this.state.year, this.state.month-1, 1))
        formData.append("expireDate", new Date(this.state.expireYear, this.state.expireMonth-1, 28))
        formData.append("price", this.state.property.price)
        formData.append("monthlyDeadLine", this.state.contract.monthlyDeadLine)

        axios.put(`${SERVER_HOST}/Contracts/confirm/${this.props.contract._id}`, formData, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
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
                    console.log("Contract accepted")
                    this.props.closeModal()
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

    cancelContract = e => {
        //server cll to accept the contract

        axios({
            method: "delete",
            url: `${SERVER_HOST}/Contracts/tenantCancelContract/${this.props.contract._id}`,
            headers: { "authorization": localStorage.token, "Content-type": "multipart/form-data" },
        }).then(res => {
            //handle success
            if(res.data)
            {            
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {       
                    console.log('Contract Canceled')    
                    this.props.closeModal()
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })

    }

    render(){ 

        let validDate = <div className="error"> Enter a valid date.</div>
        let validExpireDate = <div className="error"> Enter a valid date.</div>

        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return(
            <div id="modal"> 
                <div id="modalContent">
                    <div className="modal-body">
                        <div id="info">
                            <div id="title">
                                <h1>{this.state.property.address}</h1>
                            </div>
                            <div id="exit" onClick={this.props.closeModal}>
                                <img src= {require("../images/exit.png")} alt="/"/>
                            </div>
                        </div>
                        <div id="propertyImages">
                            {this.state.mounted ? this.state.pictures.map(picture => <img key={picture} src={`data:;base64,${picture}`} alt=""/>) : null}
                        </div>
                        <div id="propertyFields">
                            <label>Area: {this.state.property.area}</label><br/>
                            <label>Price: {this.state.property.price}</label><br/>
                       </div>
                       <div id="contractsFields">
                            <label>Start Date: {this.state.contract.date} </label> <br/>
                            <label>End Date: {this.state.contract.expireDate} </label>
                            <label>Residents: 
                                {this.state.contract.residents.map((resident, index) => <h6 key={index}>{resident.name}, {resident.id}</h6>)}
                            </label>
                       </div>
                       <div id="contractEditFields">
                            <div className="item">
                                    <select name="month" className="datefield month"  onChange={this.handleChange}>
                                        <option value="no">Month</option>
                                        <option value="01">Jan</option>
                                        <option value="02">Feb</option>
                                        <option value="03">Mar</option>
                                        <option value="04">Apr</option>
                                        <option value="05">May</option>
                                        <option value="06">Jun</option>
                                        <option value="07">Jul</option>
                                        <option value="08">Aug</option>
                                        <option value="09">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dec</option>
                                    </select>/
                                    <select name="year" className="datefield year" onChange={this.handleChange}>
                                        <option value="no">Year</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                                {formInputsState.date ? "" : validDate}

                                <div className="item">
                                        <select name="expireMonth" className="datefield month" onChange={this.handleChange}>
                                            <option value="no">Month</option>
                                            <option value="01">Jan</option>
                                            <option value="02">Feb</option>
                                            <option value="03">Mar</option>
                                            <option value="04">Apr</option>
                                            <option value="05">May</option>
                                            <option value="06">Jun</option>
                                            <option value="07">Jul</option>
                                            <option value="08">Aug</option>
                                            <option value="09">Sep</option>
                                            <option value="10">Oct</option>
                                            <option value="11">Nov</option>
                                            <option value="12">Dec</option>
                                        </select>/
                                        <select name="expireYear" className="datefield year" onChange={this.handleChange}>
                                            <option value="no">Year</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                        </select>
                                    </div>
                                {formInputsState.expireDate ? "" : validExpireDate}

                                <div className="item">
                                    <label>
                                        Last day for payment:
                                        <input className = {"form-control"}
                                                id="deadLine" 
                                                type="text" 
                                                name="deadLine" placeholder={this.state.contract.monthlyDeadLine}
                                                onChange={this.handleDeadline} ref={input => { this.inputToFocus = input }}/>
                                    </label>
                                </div>

                                <div className="item">
                                    <label>
                                        Final price per month:
                                        <input className = {"form-control"}
                                                id="finalPrice" 
                                                type="text" 
                                                name="finalPrice" placeholder={this.state.property.price} 
                                                onChange={this.handleFinalPrice}/>
                                    </label>
                                </div>
                       </div>
                        <div id="buttons">
                            <input type="button" className="green-button" value="Make Offer" disabled = {!inputsAreAllValid} onClick={this.acceptContract}/>
                            <input type="button" className="red-button" value="Cancel Offer" onClick={this.cancelContract}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}