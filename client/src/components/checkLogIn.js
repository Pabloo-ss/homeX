import React, {Component} from "react"
import {Redirect} from 'react-router-dom'

import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class checkLogIn extends Component 
{

    constructor(props) 
    {
        super(props)
        
        this.state = {
            redirectTenant:false,
            redirectResident:false,
            redirectLogIn: false,
        }
    }

    componentDidMount() {
        if (typeof localStorage.accessLevel === "undefined" || !localStorage.token || localStorage.accessLevel == ACCESS_LEVEL_GUEST)
        {
            localStorage.clear()
            localStorage.email = "GUEST"
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            this.setState({redirectLogIn:true})
            //localStorage.token = null 
        }else{
            axios({
                method: "get",
                url: `${SERVER_HOST}/Users/checkLogIn`,
                headers: { "authorization": localStorage.token },
            }).then(res => {
                //handle success
                localStorage.email = res.data.email
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token

                if(res.data.accessLevel === ACCESS_LEVEL_ADMIN){
                    this.setState({redirectTenant:true})
                }else{
                    this.setState({redirectResident:true})
                }
            }).catch(err => {
                //handle error
                localStorage.clear()
                localStorage.email = "GUEST"
                localStorage.accessLevel = ACCESS_LEVEL_GUEST
                this.setState({redirectLogIn:true})
            });
        }
    }

    render() 
    {   
        return (   
            <div>
                {this.state.redirectTenant ? <Redirect to="/tenantHome"/> : null}
                {this.state.redirectResident ? <Redirect to="/residentHome"/> : null}
                {this.state.redirectLogIn ? <Redirect to="/logInForm"/> : null}
            </div>
        )
    }
}