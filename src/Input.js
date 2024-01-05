import React from "react";
import { TextField } from '@mui/material';
import Menu from "./Menu";

class Input extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: false,
      errorText: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    try {
      let input = e.target.value;
      const menu = new Menu(input);
      this.props.onChange(menu);
      this.setState({
        error: false,
        errorText: "Success."
      });

    } catch (e) {
      this.setState({
        error: true,
        errorText: e.message
      });
    }
  }
  render(){
    return (
      <div>
        <TextField
          id="filled-multiline-static"
          fullWidth
          multiline
          rows={10}
          variant="filled"
          onChange={this.handleChange}
          error={this.state.error}
          helperText={this.state.errorText}
        />
      </div>
    )
  }
}

export default Input;