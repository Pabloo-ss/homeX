import React, {Component} from "react"
import {Redirect, Link} from 'react-router-dom'
import ContractHolderTenant from "./ContractHolderTenant"
import NavBar from "./NavBar"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class ContractTenant extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            requested: null,
            signed: null,
            completed: null,
            mounted: false
        }
    }

    componentDidMount() 
    {
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
        axios.get(`${SERVER_HOST}/ContractsSigned`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({signed: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })  

        axios({
            method: "get",
            url: `${SERVER_HOST}/ContractsCompleted`,
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
                    console.log(res.data)
                    this.setState({completed: res.data})    
                    this.setState({mounted: true})  
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }).catch(err =>{
            console.log("err:" + err.response.data) 
        })
    }
    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="1"/>
                <div className="content-container">

                    {this.state.requested? 
                        <div><br/><h2>Rent Requests</h2>
                        <div className="contractsResident">
                            {this.state.requested.map((contract, index) => <ContractHolderTenant key={index} contract={contract}/>)}
                        </div> 
                        </div>
                    : null}
                    {this.state.signed? 
                        <div><br/><h2>Sign Requests</h2>
                        <div className="contractsResident">
                            {this.state.signed.map((contract, index) => <ContractHolderTenant key={index+50} contract={contract}/>)}
                        </div> 
                        </div> 
                    : null}
                    {this.state.completed? 
                        <div><br/><h2>Active Contracts</h2>
                        <div className="contractsResident">
                            {this.state.completed.map((contract, index) => <ContractHolderTenant key={index+100} contract={contract}/>)}
                        </div> 
                        </div>
                    : null}
                </div>
            </div>

        )
    }
}
