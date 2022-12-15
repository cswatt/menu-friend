import React from "react";
import Nestable from "react-nestable";
import "./style.css";
import { parseInput, parseOutput } from "./helpers";
import TextField from '@mui/material/TextField';

const yaml = require('js-yaml')
class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      itemsTemp: []
    };

    this.handleOnChangeSort = this.handleOnChangeSort.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleOnChangeSort(items) {
    this.setState({
      itemsTemp: items
    });
    this.handleUpdate()
  }

  handleUpdate() {
    const { itemsTemp } = this.state;
    const output = parseOutput(itemsTemp, this.state.apiTemp)

    this.setState({
      input: output,
      error: false,
      errorText: "Regenerated."
    })
  }

  handleTextChange(e){
    console.log("this counts")
    try{
    var [main, api] = parseInput(e.target.value)
    this.setState({
      itemsTemp: main,
      apiTemp: api,
      error: false,
      errorText:"You did it.",
      input: e.target.value
    });
  } catch(e){
    console.log(e)
    this.setState({
      error: true,
      errorText: e.message
    });
  }
  }

  
  render() {
    return (

      <div className="main">
          
        <div className="left">
        <TextField
          id="filled-multiline-static"
          label="menus.en.yaml"
          fullWidth
          multiline
          rows={20}
          defaultValue=""
          variant="filled"
          value={this.state.input}
          onChange={this.handleTextChange}
          error={this.state.error}
          helperText={this.state.errorText}

        />
        </div>
       
       
        <div className="right">
          <div className="blurb">
            <h1>Menu Friend</h1>
            Paste your <code>menus.en.yaml</code> file on the left.
          </div>

        <Nestable
          collapsed={false}
          maxDepth={3}
          items={this.state.itemsTemp}
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