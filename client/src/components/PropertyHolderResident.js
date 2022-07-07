import React, {Component} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"
import PropertyResidentModal from "./PropertyResidentModal"

export default class PropertyHolderResident extends Component 
{

    constructor(props) 
    {
        super(props)

        
        this.state = { 
            property: this.props.property,
            image: this.props.property.images[0],
            picture: '',
            mounted: false,
            modal: false
        }
    }

    clickOn = e => {
        this.showModal()
    }

    showModal(){
        this.setState({modal: !this.state.modal})
    }

    componentDidMount() 
    {
        axios.get(`${SERVER_HOST}/Properties/image/${this.state.image.filename}`)
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
    
    
    render() 
    {
        return (
            <div className="property">
                <div className="property-content" onClick={this.clickOn}>
                    <div className="propertyMainImage">
                        {this.state.mounted ? <img id={this.state.picture} src={`data:;base64,${this.state.picture}`} alt=""/> : null}
                    </div>

                    <div className="propertyName">
                        {this.state.property.address}
                    </div>

                    <div className="city">
                        City: 
                    </div>

                    <div className="propertyPrice">
                        {this.state.property.price}€/month
                    </div>

                                  
                </div>
                {this.state.modal ? <PropertyResidentModal 
                                        property = {this.state.property}
                                        closeModal = {this.showModal.bind(this)}
                                      /> : null}
            </div>       
        )
    }
}