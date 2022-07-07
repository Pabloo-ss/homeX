import React, {Component} from "react"
import axios from "axios"
import {Redirect, Link} from 'react-router-dom'
import {SERVER_HOST} from "../config/global_constants"

export default class BillHolder extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            bill: this.props.bill,
            property: null,
            type: this.props.type,
            mounted: false
        }
    }

    componentDidMount(){
        axios.get(`${SERVER_HOST}/Properties/${this.state.bill.property}`)
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
                    this.setState({mounted: true})  
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }) 
    }

    pay = () =>{ //How are we gonna do this?

    }
    
    render() 
    {
        return (
            <div className="bill">
                <><div className="propertyName">
                    {this.state.property.address}
                </div>
                <div className="billAmount">
                    {this.state.bill.moneyAmount}
                </div>
                {this.state.bill.status == 'pending' ? 
                    <div className="deadLineBill">
                        {this.state.bill.monthlyDeadLine}
                    </div>
                : null}
                {this.state.type == 'tenant' ? 
                    <div className="residentBill">
                        {this.state.bill.resident}
                    </div>
                : null}
                {this.state.bill.status == 'paid' ? 
                    <div className="paymentDate">
                        {this.state.bill.paymentDate}
                    </div>
                : null}
                {this.state.type == 'resident' && this.state.bill.status == 'pending' ? 
                    <div className="buttons">
                        <input type="button" className="green-button" value="Pay" onClick={this.pay}></input>
                    </div>
                : null}
                </>
            </div>        
        )
    }
}