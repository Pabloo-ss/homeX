import React, {Component} from "react"
import axios from "axios"
import {Redirect,Link} from "react-router-dom"

import {SERVER_HOST} from "../config/global_constants"


export default class PropertyTenantModal extends Component{ 

    constructor(props) 
    {
        super(props)

        this.state = {property: this.props.property,
                      price: this.props.property.price,
                      area: this.props.property.area,
                      id: this.props.property._id,
                      pictures: [],
                      selectedFiles: null,
                      mounted: false,
                      redirect: false }
    }

    componentDidMount() 
    {   

        axios.get(`${SERVER_HOST}/Properties/images/${this.props.property._id}`, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
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
                        this.setState({pictures: res.data.images})
                        
                        this.setState({mounted: true})
                        
                    }   
                }
                else
                {
                    console.log("Record not found")
                }
            })
    }

    handleFileChange = (e) => 
    {
        this.setState({selectedFiles: e.target.files})
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    updateProperty = () => {
        let property = new FormData()

        property.append("area", this.state.area)
        property.append("price", this.state.price)
        if(this.state.selectedFiles)
        {
            for(let i = 0; i < this.state.selectedFiles.length; i++)
            {
                property.append("propertyImages", this.state.selectedFiles[i])
            }
        }

        axios.put(`${SERVER_HOST}/Properties/${this.props.property._id}`, property, {headers:{"authorization":localStorage.token}})
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
                    this.setState({redirect: true})
                    window.location.reload()
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
    

    deleteProperty = () => {
        axios.delete(`${SERVER_HOST}/Properties/${this.state.id}`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {
            if(res.data)
            {          
                this.setState({redirect: true})
                window.location.reload()
                console.log("Record deleted")
            }else{
                console.log("Record not deleted")
            }
        }).catch(error =>{
            console.log("err:" + error.response.data)
        })   
    }

    anyResident = () => {
        if(this.state.property.resident === 'none')
            return false
        else
            return true
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
            area: this.validateArea(),
            price: this.validatePrice(),
            images: this.validateImages(),
        }

    }


    render(){  

        //errors
        let validPrice = <div className="error">Enter a valid price.</div>
        let validArea = <div className="error">Enter a valid area.</div>

        //validation
        const formInputsState = this.validation()
        const inputsAreAllValid = Object.keys(formInputsState).every(index => formInputsState[index]) 

        return(
            <div id="modal"> 
            {this.state.redirect ? <Redirect to="/tenantHome"/> : null}
                <div id="modalContent">
                    <div className="modal-property">
                        <div id="info">
                            <div id="title" >
                                <h1>{this.state.property.address}</h1>
                            </div>
                            <div id="exit" onClick={this.props.closeModal}>
                                <img src= {require("../images/exit.png")} alt="/"/>
                            </div>
                        </div>
                        <div id="propertyImages">
                            {this.state.mounted ? this.state.pictures.map(picture => <img key={picture} src={`data:;base64,${picture}`} alt="loading"/>) : null}
                        </div>
                        <div id="propertyFieldsMod">
                                <div id="text-inputs">
                                    <label>Area
                                        <div id="item1">
                                            <input type="text" name="area" className="form-control" onChange={this.handleChange} value={this.state.area}/>m<sup>2</sup>
                                        </div>
                                        {formInputsState.area ? "" : validArea}
                                    </label>
                                    <label>Price
                                        <div id="item2">
                                            <input type="text" name="price" className="form-control" onChange={this.handleChange} value={this.state.price}/>€
                                        </div>
                                        {formInputsState.price ? "" : validPrice}
                                    </label>
                                </div>
                                <div id="other-inputs">
                                    <h5>Please upload every image at once, max 10.</h5>
                                    <input type="file" multiple onChange={this.handleFileChange}/>
                                </div>
                                { this.state.property.resident !== "none" ? <div id="residentList">
                                        <h2>Rented to: {this.state.property.resident}</h2>
                                </div> : null}
                       </div>
                        <div id="buttons">
                            <input type="button" className="red-button" value="Delete" disabled={this.anyResident()} onClick={this.deleteProperty}/>
                            <input type="button" className="green-button" value="Update" disabled = {!inputsAreAllValid} onClick={this.updateProperty}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}