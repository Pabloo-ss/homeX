import React, {Component} from "react"
import axios from "axios"
import {Link} from "react-router-dom"

import {SERVER_HOST} from "../config/global_constants"


export default class PropertyResidentModal extends Component{ 

    constructor(props) 
    {
        super(props)

        this.state = {property: this.props.property,
                      id: this.props.property._id,
                      pictures: [],
                      mounted: false}
    }

    componentDidMount() 
    {   
        axios.get(`${SERVER_HOST}/Properties/images/${this.props.property._id}`, {headers:{"authorization":localStorage.token ,"Content-type": "multipart/form-data"}})
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
                    this.setState({pictures: res.data.images})
                    
                    this.setState({mounted: true})
                    
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })
    }

    render(){ 
        return(
            <div id="modal"> 
                <div id="modalContent">
                    <div className="modal-property">
                        <div id="info">
                            <div id="title">
                                <h1>{this.state.property.address}</h1>
                            </div>
                            <div id="exit" onClick={this.props.closeModal}>
                                <img src= {require("../images/exit.png")} alt="/"/>
                            </div>
                        </div>
                        <div id="propertyImages">
                            {this.state.mounted ? this.state.pictures.map(picture => <img key={picture} src={`data:;base64,${picture}`} alt="loading..."/>) : null}
                        </div>
                        <div id="propertyFields">
                            <label>Area: {this.state.property.area} m<sup>2</sup></label><br/>
                            <label>Price: {this.state.property.price} €/month</label><br/>
                       </div>
                        <div id="buttons">
                            <Link id="rentButton" className="green-button" to={{pathname: `/rentForm`, state: this.state.property}}> Rent Request </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}