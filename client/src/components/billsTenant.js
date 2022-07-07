import React, {Component} from "react"
import axios from "axios"
import {Redirect, Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"
import NavBar from "./NavBar"
import BillHolder from "./BillHolder"

export default class BillsTenant extends Component 
{
    constructor(props) 
    {
        super(props)

        
        this.state = { 
            pending: null,
            delayed: null,
            paid: null,
            mounted: false
        }
    }

    componentDidMount() 
    {
        axios.get(`${SERVER_HOST}/Bills/pending/tenant`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({pending: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 

        axios.get(`${SERVER_HOST}/Bills/delayed/tenant`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({delayed: res.data})    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })

        axios.get(`${SERVER_HOST}/Bills/paid/tenant`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({paid: res.data})    
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
                <NavBar selected="2"/>
                <div className="content-container">
                    <h1>TENANTS BILLS PAGE</h1>

                    
                    {this.state.pending? 
                        <div className="billsPending">
                            <h2>Pending Bills</h2>
                            {this.state.pending.map((bill, index) => <BillHolder key={index} bill={bill} type={'tenant'}/>)}
                        </div> 
                    : null}
                    {this.state.delayed? 
                        <div className="billsDelayed">
                            <h2>Delayed Bills</h2>
                            {this.state.delayed.map((bill, index) => <BillHolder key={index+50} bill={bill} type={'tenant'}/>)}
                        </div> 
                    : null}
                    {this.state.paid? 
                        <div className="paidBills">
                            <h2>Paid Bills</h2>
                            {this.state.paid.map((bill, index) => <BillHolder key={index+100} bill={bill} type={'tenant'}/>)}
                        </div> 
                    : null}
                </div>
            </div>

        )
    }
}
