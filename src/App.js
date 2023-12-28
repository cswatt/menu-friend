import React from "react";
import Nestable from "react-nestable";
import "./style.css";
import { parseInput, parseOutput } from "./helpers";
import { TextField, Button, Snackbar } from '@mui/material';


const yaml = require('js-yaml')
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
      items: temp.items
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
            <ol>
              <li/>Paste your <code>menus.en.yaml</code> file on the left.
              <li/>Edit the visualization that appears.
              <li/>Copy the new YAML into your file.
            </ol>
            
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
       
       
        <div className="justified">
          

        <Nestable
          collapsed={false}
          maxDepth={3}
          items={this.state.items}
          renderItem={({ item, collapseIcon }) => (
            <div className="listMenu">
              {collapseIcon}
              {item.name}
              &nbsp;&nbsp;
              <small>{item.url}</small>
            </div>
          )}
          onChange={this.handleOnChangeSort}
          renderCollapseIcon={({ isCollapsed }) =>
            isCollapsed ? (
              <span className="iconCollapse">+</span>
            ) : (
              <span className="iconCollapse">-</span>
            )
          }
        />
        </div>
        </div>

    );
  }
}

export default App;
