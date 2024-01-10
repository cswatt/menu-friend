import React from "react";
import { Drawer, Button, TextField } from "@mui/material";

const drawerStyle = {
  margin: ".5rem",
  padding: ".5rem"
};

const formItem = {
  padding: ".5rem"
};

const formStyle = {
  width: "65rem",
  margin: "auto",
  paddingTop: "2rem",
  paddingBottom: "2rem"
}

const cancelButtonStyle = {
  float: "right"
};

const headingStyle={
  fontSize: "2rem"
};

const buttonStyle = {
  marginRight: ".5rem",
  float: "left"
}

class ItemForm extends React.Component{
  handleSubmit(e){
    // ensure changes occurred
    if (this.hasChange()){

      // check that identifier, if changed, is unique
      if (this.identifierUniqueError()){
        this.setState({
          error: true,
          errorText: "Identifier must be unique."
        })
        
      } else if (this.identifierBlank()){
        this.setState({
          error: true,
          errorText: "Must have an identifier."
        })

      } else {
        this.props.handleSubmit(this.state.changes)
        this.setState({ 
          changes: {},
          error: false,
          errorText: ""
        })
      }
    } else {
      console.log("no changes")
      this.handleEmptySubmit()
    }
  }

  handleEmptySubmit(){
    this.setState({
      buttonText: "Nothing to save"
    })
    setTimeout(() => {
      this.setState({
        buttonText: ""
      });
    }, 3000);
  }

  handleReset(e){
    this.setState({
      changes: {},
      display: {...this.state.original}
    })
  }
  handleChange(e){
    const { name, value } = e.target
    const { changes, display } = this.state;
    changes[name] = value;
    display[name] = value;
    this.setState({
      changes: changes,
      display: display
    })
  }
  handleCancel(e){
    this.props.onClose()
  }
  identifierBlank(){
    let { changes } = this.state;
    if (!changes.identifier){
      return true
    }
  }

  render(){
    return(
      <div style={({...formStyle})}>
        <div style={({...formItem})}>
          <div style={({...headingStyle})}>
            {this.state.heading}
          </div>
        </div>
        <div style={({...formItem})}>
          <TextField
            label="Name"
            name="name"
            value={this.state.display.name || ""}
            onChange={this.handleChange.bind(this)}
            variant="standard"
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            label="Identifier"
            name="identifier"
            required
            value={this.state.display.identifier || ""}
            onChange={this.handleChange.bind(this)}
            variant="standard"
            error={this.state.error}
            helperText={this.state.errorText}
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            label="pre"
            name="pre"
            value={this.state.display.pre || ""}
            onChange={this.handleChange.bind(this)}
            variant="standard"
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={this.state.display.url || ""}
            onChange={this.handleChange.bind(this)}
            variant="standard"
          />
        </div>
        <br/>
        <div style={({...formItem})}>
          To set the following fields, use the interface.
        </div>
        <div style={({...formItem})}>
          <TextField
            required
            disabled
            label="Parent"
            name="parent"
            value={this.state.original.parent || "no parent"}
            variant="standard"
          />
        </div>
        <div style={({...formItem})}>
          <TextField
            required
            disabled
            label="Weight"
            name="weight"
            value={this.state.original.weight || "to be determined"} 
            variant="standard"
          />
        </div>
        <div style={({...formItem})}>
        <div style={({...buttonStyle})}>
          <Button
            type="submit"
            onClick={this.handleReset.bind(this)}
            variant="outlined"
          >
            RESET
          </Button>
          </div>
          <div style={({...buttonStyle})}>
          <Button
            type="submit"
            onClick={this.handleSubmit.bind(this)}
            variant="contained"
          >
            {this.state.buttonText || 'SAVE'}
          </Button>
          </div>
          <div style={({...cancelButtonStyle})}>
            <Button
              type="submit"
              onClick={this.handleCancel.bind(this)}
              variant="outlined"
            >
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    )
  }

}

class Edit extends ItemForm {
  constructor(props){
    super(props)
    this.state = {
      heading: "Edit item",
      original: {...this.props.item},
      display: {...this.props.item},
      changes: {},
      menuKeys: this.props.menuKeys,
      error: false,
      errorText: ""
    };
    this.hasChange = this.hasChange.bind(this);
    this.identifierUniqueError = this.identifierUniqueError.bind(this)
  }
  
  identifierUniqueError(){
    let { changes, original, menuKeys } = this.state;
    if (changes.identifier !== original.identifier && menuKeys.has(changes.identifier)){
      return true;
    }
  }
  hasChange(){
    let { changes, original } = this.state;
    for (let key in changes){
      if (changes[key] !== original[key]) {return true}
    }
    return false
  }
}

class Add extends ItemForm {
  constructor(props){
    super(props)
    this.state = {
      heading: "Add item",
      original: {"parent": this.props.item.parent},
      display: {"parent": this.props.item.parent},
      changes: {},
      menuKeys: this.props.menuKeys,
      error: false,
      errorText: ""
    };
    this.hasChange = this.hasChange.bind(this);
    this.identifierUniqueError = this.identifierUniqueError.bind(this);
  }

  identifierUniqueError(){
    let { changes, original, menuKeys } = this.state;
    if (changes.identifier !== original.identifier && menuKeys.has(changes.identifier)){
      return true;
    }
  }

  hasChange(){
    let { changes } = this.state;
    for (let key in changes){
      if (changes[key]) {
        return true;
      }
    }
    return false;
  }
}



class ItemPanel extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(changes){
    if(changes){
      this.props.submit(this.props.mode, this.props.item, changes)
    }
    this.props.onClose()
  }
  
  render(){
    const panelMode = this.props.mode

    return(
      <div style={({...drawerStyle})}>
        <Drawer
            anchor="top"
            open={this.props.open}
            onClose={this.props.onClose}>
              {panelMode === "edit" && (
                <Edit
                  item={this.props.item}
                  menuKeys={this.props.menuKeys}
                  handleSubmit={this.handleSubmit}
                  onClose={this.props.onClose}
                />
              )}
              {panelMode === "add" && (
                <Add
                  item={this.props.item}
                  menuKeys={this.props.menuKeys}
                  handleSubmit={this.handleSubmit}
                  onClose={this.props.onClose}
                />
              )}
          </Drawer>
      </div>
    )
  }
}

export default ItemPanel;