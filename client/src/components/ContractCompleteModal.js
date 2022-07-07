import React, {Component} from "react"
import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class ContractCompleteModal extends Component{ 

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
        let images = []
        this.state.property.images.map(fileName => {
            axios.get(`${SERVER_HOST}/Properties/images/${fileName}`)
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
                        images.push(res.data.image)      
                    }   
                }
                else
                {
                    console.log("Record not found")
                }
            })
            this.setState({pictures: images})
            this.setState({mounted: true})
        })
    }

    completeContract = e => {
        //server cll to complete the contract
        axios({
            method: "put",
            url: `${SERVER_HOST}/Contracts/complete/${this.props.contract._id}`,
            headers: { "authorization": localStorage.token },
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
                    console.log("Contract completed")
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
        //server cll to cancel the contract
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
                        <div id="buttons">
                            <input type="button" className="green-button" value="Sign and Complete" onClick={this.completeContract}/>
                            <input type="button" className="red-button" value="Cancel Offer" onClick={this.cancelContract}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}