import React, {Component} from "react"
import ContractHolder from "./ContractHolderResident"
import NavBar from "./NavBarResidents"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class ContractTenant extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            requested: null,
            confirmed: null,
            completed: null,
            mounted: false
        }
    }

    componentDidMount() 
    {
        axios.get(`${SERVER_HOST}/ContractsConfirmed`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({confirmed: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 
        axios.get(`${SERVER_HOST}/ContractsRequested`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({requested: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })
        axios.get(`${SERVER_HOST}/ContractsCompleted`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({completed: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 
    }
    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="1"/>
                <div className="content-container">
                    {this.state.requested?
                        <div>
                            <h2>Rent Offers Requested</h2>
                            <div className="contractsResident">
                                {this.state.requested.map((contract, index) => <ContractHolder key={index} contract={contract} />)}
                            </div>
                        </div>
                    : null}
                    {this.state.confirmed? 
                        <div><br/><h2>Rent Offers to Sign</h2>
                        <div className="contractsResident">
                            {this.state.confirmed.map((contract, index) => <ContractHolder key={index} contract={contract} />)}
                        </div></div> 
                    : null}
                    {this.state.completed? 
                        <div><br/><h2>Active Contracts</h2>
                        <div className="contractsResident">
                            {this.state.completed.map((contract, index) => <ContractHolder key={index + 100} contract={contract} />)}
                        </div></div> 
                    : null}
                </div>
            </div>

        )
    }
}
