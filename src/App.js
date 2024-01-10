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
      output: ""
    };
    
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleOnChangeSort = this.handleOnChangeSort.bind(this);
    
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleAddButton = this.handleAddButton.bind(this);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.handlePanelSubmit = this.handlePanelSubmit.bind(this);

    this.updateAll = this.updateAll.bind(this);

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

  handleEditButton(e) {
    this.openPanel("edit", e.item)
  }

  handleAddButton(e){
    this.openPanel("add", e.item)
  }

  handleDeleteButton(e){
    let { menuObject } = this.state;
    menuObject.deleteItem(e.item)
    this.updateAll(menuObject)
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
    if (mode === "edit"){menu.editItem(item, changes)}
    if (mode === "add"){
      menu.addItem(item, changes)
    }
    this.updateAll(menu)
  }

  // update everybody
  updateAll(_menu) {
    let menu = _menu
    this.setState({
      menuObject: menu,
      items: menu.nest,
      apiTemp: menu.api,
      output: menu.parseOutput(),
      menuKeys: menu.getIdentifiers()
    })
  }

  render() {
    return (
      <div className="main">

        <div className="justified">
          <div className="blurb">
            <h1>Menu Friend</h1>

            1. Paste your <code>menus.en.yaml</code> file on the left.<br />
            2. Edit the visualization that appears.<br />
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
          handleEdit={this.handleEditButton}
          handleAdd={this.handleAddButton}
          handleDelete={this.handleDeleteButton}
        />

        <ItemPanel
          mode={this.state.panelMode}
          item={this.state.currentItem}
          open={this.state.panelOpen}
          menuKeys={this.state.menuKeys}
          onClose={this.closePanel}
          submit={this.handlePanelSubmit}
        />
      </div>

    );
  }
}

export default App;
