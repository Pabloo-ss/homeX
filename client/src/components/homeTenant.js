import axios from "axios"
import React, {Component} from "react"
import {Link} from 'react-router-dom'
import NavBar from "./NavBar"
import PropertyHolderTenant from "./PropertyHolderTenant"
import {SERVER_HOST} from "../config/global_constants"

export default class HomeTenant extends Component 
{

    constructor(props) 
    {
        super(props)

        this.state = { 
            properties: [], 
            mounted: false
        }
    }

    componentDidMount(){
        axios({
            method: "get",
            url: `${SERVER_HOST}/Properties/tenant/`,
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
                    this.setState({properties: res.data})
                    this.setState({mounted: true})
                }   
            }
            else
            {
                console.log("Record not found")
            }
        }).catch(err => {
            //handle error
            console.log(err)
        });
    }

    render() 
    {   
        return (       
            <div className="web-container"> 
                <NavBar selected="0"/>
                <div className="content-container">
                    <div className="search">
                        <input className="form-control"
                            id="searchBar"
                            type="text"
                            name="searchText" placeholder="Search anything" />
                        <Link className="blue-button" to="/tenantAddPropForm">
                            Add property
                        </Link>
                    </div>
                    <div className="properties-container">
                        <h2> My properties.</h2>
                        <div className="propertiesGrid">
                            {this.state.mounted ? this.state.properties.map((property) => <PropertyHolderTenant key={property._id} property={property}/> ) : null}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
