import React, {Component} from "react"
import axios from "axios"
import {Redirect, Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"
import ContractConfirmModal from "./ContractConfirmModal.js"
import ContractCompleteModal from "./ContractCompleteModal.js"

export default class ContractHolderTenant extends Component 
{

    constructor(props) 
    {
        super(props)
        
        this.state = { 
            contract: this.props.contract,
            property: null,
            picture: '',
            mounted: false,
            requestedModal: false,
            redirect: false,
            completeModal: false
        }
    }

    componentDidMount() 
    {
        axios.get(`${SERVER_HOST}/Properties/${this.state.contract.property}`)
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
                    this.setState({property: res.data})  
                    axios.get(`${SERVER_HOST}/Properties/image/${res.data.images[0].filename}`, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
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
                                this.setState({picture: res.data.image})    
                                this.setState({mounted: true})  
                            }   
                        }
                        else
                        {
                            console.log("Record not found")
                        }
                    }) 
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 
    }
    
    confirm = e => {
        //confirming a contract will open a form of contract to change some data and send it to the resident 
        this.setState({requestedModal: !this.state.requestedModal})
    }

    complete = e => {
        this.setState({completeModal: !this.state.completeModal})
    }

    contact = e => {
        console.log('Comunicating...')
    }

    showRequestedModal(){
        this.setState({ requestedModal: !this.state.requestedModal, redirect: true})
        window.location.reload()
    }

    showCompletedModal(){
        this.setState({ requestedModal: !this.state.completeModal, redirect: true})
        window.location.reload()
    }
    
    render() 
    {
        return (
            <div className="contract">
                {this.state.redirect ? <Redirect to="/tenantContracts"/> : null}
                {this.state.mounted ? 
                    <><div className="propertyName">
                        {this.state.property.address}
                    </div>
                    <div className="contractMainImage">
                        {this.state.mounted ? <img id={this.state.picture} src={`data:;base64,${this.state.picture}`} alt="Loading..." /> : null}
                    </div>
                    <div className="contractInfo">
                        {this.state.property.price}
                    </div>
                    <div className="buttons">
                        {this.state.contract.status === 'requested' ? <input type="button" className="green-button" value="Accept" onClick={this.confirm} /> : null}
                        {this.state.contract.status === 'signed' ? <input type="button" className="green-button" value="Complete" onClick={this.complete} /> : null}
                        {this.state.contract.status === 'completed' ? <input type="button" className="green-button" value="Contact" onClick={this.contact} /> : null}
                    </div></> : null}

                    {this.state.requestedModal ? <ContractConfirmModal 
                                        contract = {this.state.contract}
                                        property = {this.state.property}
                                        closeModal = {this.showRequestedModal.bind(this)}
                                      /> : null} 

                    {this.state.completeModal ? <ContractCompleteModal
                                        contract = {this.state.contract}
                                        property = {this.state.property}
                                        closeModal = {this.showCompletedModal.bind(this)}
                                      /> : null} 
            </div>        
        )
    }
}