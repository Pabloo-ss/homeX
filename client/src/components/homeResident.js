import React, {Component} from "react"
import NavBar from "./NavBarResidents"
import axios from "axios"
import PropertyHolderResident from "./PropertyHolderResident"
import {SERVER_HOST} from "../config/global_constants"

export default class HomeResident extends Component 
{
    constructor(props) 
    {
        super(props)

        this.state = { 
            lessProperties: [], 
            allProperties: [],
            mounted: false,
            completeGrid: false,
        }
    }

    componentDidMount(){
        axios({
            method: "get",
            url: `${SERVER_HOST}/Properties/resident`,
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
                    let finalData =[]
                    if(res.data.length > 6){
                        for(let i=0; i<6; i++){
                            finalData.push(res.data[i])
                        }
                    }else{
                        for(let i=0; i<res.data.length; i++){
                            finalData.push(res.data[i])
                        }
                    }
                    this.setState({allProperties: res.data})
                    this.setState({lessProperties: finalData})
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

    changeGrid = e => {
        this.setState({completeGrid: !this.state.completeGrid})

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
                            {!this.state.completeGrid ? <button className="blue-button" onClick={this.changeGrid}>More properties.</button> : <button className="blue-button" onClick={this.changeGrid}>Less properties.</button>}
                            
                    </div>
                    <div className="properties-container">
                        {this.state.completeGrid ? 
                        <div className="completePropertiesGrid">
                            {this.state.mounted ? this.state.allProperties.map((property, index) => <PropertyHolderResident key={property._id} property={property}/>) : null}
                        </div>
                        : 
                        <div className="propertiesGrid">
                            {this.state.mounted ? this.state.lessProperties.map((property, index) => <PropertyHolderResident key={property._id} property={property}/>) : null}
                            <input type="image" src={require("../images/blackArrow.png")} className="round-blue-button" onClick={this.changeGrid} alt="loading..."/>
                        </div>
                        }
                    </div>    

                </div>
            </div>
        )
    }
}