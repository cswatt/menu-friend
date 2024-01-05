import React from "react";
import "./style.css";
import NestMenu from "./NestMenu";
import Input from "./Input";
import Output from "./Output";
import ItemPanel from "./ItemPanel"

const columnStyle = {
  float: "left",
  width: "46%",
  margin: "1%"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    

    this.state = {
      menuObject: false,
      panelOpen: false,
      panelMode: "",
      items: [],
      currentItem: [],
      output: "",
      editOpen: false,
      addOpen: false
    };

    this.deleteItem = this.deleteItem.bind(this);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleOnChangeSort = this.handleOnChangeSort.bind(this);
    
    this.handleEditOpen = this.handleEditOpen.bind(this);
    this.handleAddOpen = this.handleAddOpen.bind(this);
    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.handlePanelSubmit = this.handlePanelSubmit.bind(this);

    this.updateAll = this.updateAll.bind(this);

  }


  deleteItem(item){
    console.log(item)
  }

  // passed to Input component
  handleTextChange(menu) {
    this.updateAll(menu)
  }

  // passed to NestMenu component
  handleOnChangeSort(e) {
    let menu = this.state.menuObject
    menu.updateFromNest(e)
    this.updateAll(menu)
  }

  handleEditOpen(item) {
    this.openPanel("edit", item)
  }

  handleAddOpen(item){
    this.openPanel("add", item)
  }

  openPanel(mode, item){
    this.setState({
      panelOpen: true,
      currentItem: item,
      panelMode: mode
    })
  }

  // passed to ItemPanel
  closePanel(){
    this.setState({panelOpen: false})
  }

  handlePanelSubmit(mode, item, changes){
    let menu = this.state.menuObject
    menu.updateItem(item, changes)
    this.updateAll(menu)
  }

  // update everybody
  updateAll(_menu) {
    let menu = _menu
    this.setState({
      menuObject: menu,
      items: menu.nest,
      apiTemp: menu.api,
      output: menu.parseOutput()
    })
  }

  render() {
    return (
      <div className="main">

        <div className="justified">
          <div className="blurb">
            <h1>Menu Friend</h1>

            1. Paste your <code>menus.en.yaml</code> file on the left.<br />
            2. Edit the visualization that appears. Currently, you can edit items.<br />
            3. Copy the new YAML into your file.
          </div>
        </div>

        <div style={({ ...columnStyle })}>
          <Input
            onChange={this.handleTextChange}
            error={this.state.error}
          />
        </div>

        <div style={({ ...columnStyle })}>
          <Output
            output={this.state.output}
          />
        </div>

        <NestMenu
          items={this.state.items}
          onChange={this.handleOnChangeSort}
          handleEdit={this.handleEditOpen}
          handleAdd={this.handleAddOpen}
          handleDelete={this.deleteItem}
        />

        <ItemPanel
          mode={this.state.panelMode}
          item={this.state.currentItem}
          open={this.state.panelOpen}
          onClose={this.closePanel}
          submit={this.handlePanelSubmit}
        />
      </div>

    );
  }
}

export default App;
