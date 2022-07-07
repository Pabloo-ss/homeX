import React, {Component} from "react"
import {Redirect} from "react-router-dom"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_GUEST} from "../config/global_constants"

export default class LogOut extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            id: this.props.match.params.id,
            redirect: false
        }
    }
    
   
    componentDidMount() 
    { 
        axios.post(`${SERVER_HOST}/Users/logout`)
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
                    console.log("User logged out")
                    localStorage.clear()   
    
                    localStorage.emial = "GUEST"
                    localStorage.accessLevel = ACCESS_LEVEL_GUEST

                    this.setState({redirect: true})
                }
            }
            else
            {
                console.log("Logout failed")
            }
        }).catch(error =>{
            console.log("err:" + error.response.data)
        })                     
    }

    render() 
    {   
        return (           
            <div className="form-container">
                {this.state.redirect ? <Redirect to="/"/> : null}
            </div> 
        )
    }
}