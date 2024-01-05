import React from "react";
import { TextField, Button, Snackbar } from '@mui/material';

const rightStyle = {
  marginLeft: "5%"
};

class Output extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackOpen: false
    }
    this.handleButton = this.handleButton.bind(this);
  }
  handleButton() {
    this.setState({ snackOpen: true })
    navigator.clipboard.writeText(this.props.output);
  }
  render() {
    return (
      <div>
        <div style={({ ...rightStyle})}>
          <TextField
            id="filled-multiline-static"
            fullWidth
            multiline
            rows={10}
            variant="filled"
            value={this.props.output}
            helperText="Clean updated YAML."

          />
        </div>
        <div className="button">
          <Button
            variant="contained"
            onClick={this.handleButton}
          >
            Copy
          </Button>
          <Snackbar
            open={this.state.snackOpen}
            onClose={() => this.setState({ snackOpen: false })}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </div>
      </div>
    )
  }
}

export default Output;