import { DragIndicator, Add, Remove, Edit, AddCircle, Delete } from '@mui/icons-material';
import Nestable from "react-nestable";
import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";

// styles
const nestItem = {
  position: "relative",
  background: "#f2ecfc",
  display: "flex"
};

const nestIcon = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "100%",
  cursor: "pointer",
  borderRight: "1px solid #e6d6f9"
};

const nestItemText = {
  padding: ".5rem",
  flex: 1
};

const nestItemRight = {
  padding: ".5rem",
  width: "5rem",
  textAlign: "right"
};

const rowIcon = {
  // display: "none"
}

const Handler = () => {
  return (
    <div style={({ ...nestIcon })}>
      <DragIndicator />
    </div>
  );
}

const Collapser = ({ isCollapsed }) => {
  return (
    <div style={{ ...nestIcon }}>
      {isCollapsed ? <Add /> : <Remove />}
    </div>
  );
}

class NestItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isActive: false
    };
    this.setActive = this.setActive.bind(this)
  }
  setActive(b = Boolean){
    this.setState({isActive: b})
  }
  render(){
    return(
      <div style={{ ...nestItem }}
        onMouseOver={() => {this.setActive(true)}}
        onMouseOut={() => {this.setActive(false)}}
      >
        {this.props.handler}
        {this.props.collapseIcon}
  
        <div style={{ ...nestItemText }}>
          {this.props.item.name} &nbsp;&nbsp;
          <small>{this.props.item.url}</small>
        </div>
        
          {this.state.isActive && (
          <div style={{ ...rowIcon }}>
          <Tooltip title="Edit" placement="top">
            <IconButton
              size="small"
              onClick={this.props.handleEdit}
            >
              <Edit/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add item after this" placement="top">
          <IconButton
            size="small"
            onClick={this.props.handleAdd}
          >
            <AddCircle/>
          </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
          <IconButton
            size="small"
            onClick={this.props.handleDelete}
          >
            <Delete/>
          </IconButton>
          </Tooltip>
          </div>
          )}
        <div style={{ ...nestItemRight }}>
          {this.props.item.weight}
        </div>
      </div>
    )
  }
}

class NestMenu extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      collapseAll: false
    }
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse(){
    this.setState({
      collapseAll: !this.state.collapseAll
    })
  }

  renderItem = (props) => {
    const { item, collapseIcon, handler } = props;
    return (
      <div>
        <NestItem
          item={item}
          collapseIcon={collapseIcon}
          handler={handler}
          handleEdit={() => {this.props.handleEdit({item})}}
          handleAdd={() => {this.props.handleAdd({item})}}
          handleDelete={() => {this.props.handleDelete({item})}}
        />
      </div>
    );
  };

  render() {
    return (
      <div className="justified">
        <Button
          onClick={this.handleCollapse}
        >
          {this.state.collapseAll ? "expand all" : "collapse all"}
        </Button>
        <Nestable
          collapsed={this.state.collapseAll}
          maxDepth={4}
          items={this.props.items}
          handler={<Handler />}
          renderItem={this.renderItem}
          onChange={this.props.onChange}
          renderCollapseIcon={({ isCollapsed }) => (<Collapser isCollapsed={isCollapsed} />)}
        />
      </div>
    )
  }
}

export default NestMenu;