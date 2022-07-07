import React, {Component} from "react"
import axios from "axios"
import {Redirect, Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"
import ContractToSignModal from "./ContractToSignModal"

export default class ContractHolderResident extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            contract: this.props.contract,
            property: null,
            picture: '',
            mounted: false,
            modal: false,
            redirect: false,
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
    
    cancel = e => {
        axios.delete(`${SERVER_HOST}/Contracts/residentCancelContract/${this.state.contract._id}`, {headers:{"authorization":localStorage.token}})
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
                    window.location.reload()
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 
    }
    
    sign = e => {
        //confirming a contract will open a form of contract to change some data and send it to the resident 
        this.setState({modal: !this.state.modal})
    }

    contact = e => {
        console.log('Comunicating...')
    }

    showModal(){
        this.setState({ modal: !this.state.modal, redirect: true})
    }
    
    render() 
    {
        return (
            <div className="contract">
                {this.state.redirect ? <Redirect to="/residentHome"/> : null}
                {this.state.mounted ? 
                    <><div className="propertyName">
                        {this.state.property.address}
                    </div>
                    <div className="contractMainImage">
                        {this.state.mounted ? <img id={this.state.picture} src={`data:;base64,${this.state.picture}`} alt="Loading..." /> : null}
                    </div>
                    <div className="contractInfo">
                        {this.state.property.price}€/month
                    </div>
                    <div className="buttons">
                        {this.state.contract.status == 'requested' ? <input type="button" className="red-button" value="Cancel Request" onClick={this.cancel} /> : null}
                        {this.state.contract.status == 'confirmed' ? <input type="button" className="green-button" value="Sign" onClick={this.sign} /> : null}
                        {this.state.contract.status == 'completed' ? <input type="button" className="green-button" value="Contact" onClick={this.contact} /> : null}
                    </div></> : null}

                    {this.state.modal ? <ContractToSignModal 
                                        contract = {this.state.contract}
                                        property = {this.state.property}
                                        closeModal = {this.showModal.bind(this)}
                                      /> : null} 
            </div>        
        )
    }
}