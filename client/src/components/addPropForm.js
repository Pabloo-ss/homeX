import React, {Component} from "react"
import {Redirect, Link} from 'react-router-dom'
import NavBar from "./NavBar"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

export default class addPropForm extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = {
            tenant: localStorage.email,
            address: {
                street: '',
                number: '',
                floor: ''
            },
            area: '',
            price: '',
            selectedFiles: null,
            redirect:false,
            propExitsError: false,
            errorMessage: '',
        }

    }

    componentDidMount()
    {
        this.inputToFocus.focus()
    }

    validateAdress() {
        if(this.state.address.street === '' || this.state.address.number === '' || this.state.address.floor === ''){
            return false
        }else{
            return true
        }
    }

    validateArea() {
        let num = parseInt(this.state.area) || 'NaN'
        if( num === 'NaN' ){
            return false
        }else{
            if(parseInt(this.state.area) <= 0){
                return false
            }else{
                return true
            }
        }
    }

    validatePrice() {
        let num = parseInt(this.state.price) || 'NaN'
        if( num === 'NaN' ){
            return false
        }else{
            if(parseInt(this.state.price) <= 0){
                return false
            }else{
                return true
            }
        }
    }

    validateImages(){
        if(this.state.selectedFiles){
            if(this.state.selectedFiles.length >= 10){
                return false
            }else{
                return true
            }
        }
    }

    validation(){
        return {
            address: this.validateAdress(),
            area: this.validateArea(),
            price: this.validatePrice(),
            images: this.validateImages(),
        }

    }


    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})

    }

    handleAddress = e => {
        const changeAddress = function(e, component){
            let address = component.state.address;
            address[e.target.name] = e.target.value;
            return { address };
        }
        this.setState(changeAddress(e, this))
        
    }

    handleFileChange = (e) => 
    {
        this.setState({selectedFiles: e.target.files})
    }

    addProperty = e => {

        let formData = new FormData()  
        let textAddress = this.state.address.street + ', number ' + this.state.address.number + ', ' + this.state.address.floor + '.'
        formData.append("address", textAddress)
        formData.append("area", this.state.area)
        formData.append("price", this.state.price) 
        formData.append("tenant", this.state.tenant) 

        if(this.state.selectedFiles)
        {
            for(let i = 0; i < this.state.selectedFiles.length; i++)
            {
                formData.append("propertyImages", this.state.selectedFiles[i])
            }
        }

        axios.post(`${SERVER_HOST}/Properties/AddNew`, formData, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
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

    render() 
    {   
        //errors
        let addressEmpty = <div className="error">Enter a valid address.</div>
        let validPrice = <div className="error">Enter a valid price.</div>
        let validArea = <div className="error">Enter a valid area.</div>

        //validation
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return (       
            <div className="web-container"> 
                {this.state.redirect ? <Redirect to="/tenantHome"/> : null}
                <NavBar selected="0"/>
                <div className="content-container">
                    <div className="addProp-form-container">
                        <div className="name-container">
                            <h1>Add New Property</h1>
                        </div>
                        <div className="address-container">
                            <div className="text-container">
                                <h4> Address </h4>
                            </div>
                            <div className="inputs-container">
                                <div className="item1">
                                <input className = "form-control"
                                    id="street" 
                                    type="text" 
                                    name="street" placeholder="Property Street" 
                                    onChange={this.handleAddress} ref = {input => {this.inputToFocus = input}}/>
                                </div>

                                <div className="item2">
                                    <input className = "form-control"
                                        id="number" 
                                        type="text" 
                                        name="number" placeholder="Street Number" 
                                        onChange={this.handleAddress}/>
                                </div>

                                <div className="item3">
                                    <input className = "form-control"
                                        id="floor" 
                                        type="text" 
                                        name="floor" placeholder="Building's Floor" 
                                        onChange={this.handleAddress}/>
                                </div>
                            </div>
                            {formInputsState.address ? "" : addressEmpty}
                        </div>
                        <div className="props-container">
                            <div className="items-container">
                                <div className="items-container">
                                    <div className="item">
                                        <input className = {"form-control"}
                                            id="area" 
                                            type="text" 
                                            name="area" placeholder="Property Area" 
                                            onChange={this.handleChange}/>
                                        m<sup>2</sup>
                                    </div>
                                {formInputsState.area ? "" : validArea}
                                </div>
                                <div className="items-container">
                                    <div className="item">
                                        <input className = {"form-control"}
                                            id="price" 
                                            type="text" 
                                            name="price" placeholder="Property Price" 
                                            onChange={this.handleChange}/>
                                            €.
                                    </div>
                                    {formInputsState.price ? "" : validPrice}
                                </div>
                            </div>

                            <div className="images-container">
                                <h5>Please upload every image at once, max 10.</h5>
                                <input type="file" multiple onChange={this.handleFileChange}/>
                            </div>
                        </div>
                        <div className="button-container">
                            <input type="button" className="green-button" value="Add Property" disabled = {!inputsAreAllValid} onClick={this.addProperty}/>
                            <Link className="red-button" to="/tenantHome"> Cancel Rental</Link>
                        </div> 
                    </div>             
                </div>
            </div>
        )
    }
}
