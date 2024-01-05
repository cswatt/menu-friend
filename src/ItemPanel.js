import React from "react";
import { Drawer, Button, TextField } from "@mui/material";

const drawerStyle = {
  padding: ".5rem"
};

const formItem = {
  padding: ".5rem"
};

class Edit extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <div style={({...formItem})}>
          <TextField
            label="Name"
            name="name"
            defaultValue={this.props.item.name}
            onChange={this.props.handleChange}
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            label="Identifier"
            name="identifier"
            defaultValue={this.props.item.identifier}
            onChange={this.props.handleChange}
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            fullWidth
            label="URL"
            name="url"
            defaultValue={this.props.item.url}
            onChange={this.props.handleChange}
          />
        </div>
      </div>
    )
  }
}

class Add extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
      <div style={({...formItem})}>
              <TextField
                label="Name"
                name="name"
                defaultValue={this.props.item.name}
                onChange={this.props.handleChange}
              />
              </div>
              <div style={({...formItem})}>
              <TextField
                label="Identifier"
                name="identifier"
                defaultValue={this.props.item.identifier}
                onChange={this.props.handleChange}
              />
              </div>
              <div style={({...formItem})}>
              <TextField
                fullWidth
                label="URL"
                name="url"
                defaultValue={this.props.item.url}
                onChange={this.props.handleChange}
              />
              </div>
              </div>
    )
  }
}

class ItemPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      changes: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e){
    this.props.submit(this.props.mode, this.props.item.item, this.state.changes)
    this.setState({ changes: {}})
  }

  handleChange(e){
    const {name, value } = e.target
    const { changes } = this.state;
    changes[name] = value;
    // this.setState({ changes.[name]: value})
  }
  
  render(){
    return(
      <div style={({...drawerStyle})}>
        <Drawer
            anchor="top"
            open={this.props.open}
            onClose={this.props.onClose}>
              {this.props.mode == "edit" && (
                <Edit
                  item={this.props.item.item}
                  handleChange={this.handleChange}
                />
              )}
              <div style={({...formItem})}>
              <Button
                type="submit"
                onClick={this.handleSubmit}
              >
                SAVE
              </Button>
              </div>
          </Drawer>
      </div>
    )
    
    
  }
}

export default ItemPanel;