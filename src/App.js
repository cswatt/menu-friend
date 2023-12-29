import React from "react";
import "./style.css";
import { parseInput, parseOutput } from "./helpers";
import { TextField, Button, Snackbar } from '@mui/material';
import Nest from "./Nest";

class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      leftHelperText: "Paste your YAML here.",
      rightHelperText: "Clean updated YAML.",
      output: "",
      snackOpen: false
    };

    this.handleOnChangeSort = this.handleOnChangeSort.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCopyButton = this.handleCopyButton.bind(this);

  }

  handleTextChange(e){
    try{
      let inputTemp = e.target.value;
      var [main, api] = parseInput(inputTemp)
    this.setState({
      items: main,
      apiTemp: api,
      error: false,
      leftHelperText: "Success. Edit this text to regenerate.",
    });
  } catch(e){
    console.log(this.state)
    this.setState({
      error: true,
      leftHelperText: e.message
    });
  }
  }


  handleOnChangeSort(temp) {
    const output = parseOutput(temp, this.state.apiTemp)
    this.setState({
      output: output,
      items: temp
    });
    
  }

  handleCopyButton() {
    this.setState({ snackOpen: true})
    navigator.clipboard.writeText(this.state.output);
  }
  
  render() {
    return (
      <div className="main">

        <div className="justified">
        <div className="blurb">
            <h1>Menu Friend</h1>
            
              1. Paste your <code>menus.en.yaml</code> file on the left.<br/>
              2. Edit the visualization that appears. Note that the displayed weight doesn't change (TODO)<br/>
              3. Copy the new YAML into your file.
          </div>
        </div>
          
        <div className="column">
        <TextField
          id="filled-multiline-static"
          fullWidth
          multiline
          rows={10}
          variant="filled"
          onChange={this.handleTextChange}
          error={this.state.error}
          helperText={this.state.leftHelperText}
        />

        </div>

        <div className="column">
          <div className="right">
        <TextField
          id="filled-multiline-static"
          fullWidth
          multiline
          rows={10}
          variant="filled"
          value={this.state.output}
          helperText={this.state.rightHelperText}

        />
        </div>
        <div className="button">
        <Button
           variant="contained"
           onClick={this.handleCopyButton}
        >
          Copy
        </Button>
        <Snackbar
          open={this.state.snackOpen}
          onClose={() => this.setState({ snackOpen: false})}
          autoHideDuration={2000}
          message="Copied to clipboard"
        />
        </div>
        
        </div>
       
        <Nest
          items={this.state.items}
          onChange={this.handleOnChangeSort}
        />
        </div>

    );
  }
}

export default App;
