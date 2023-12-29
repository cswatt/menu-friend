import { DragIndicator, Add, Remove } from '@mui/icons-material';
import Nestable from "react-nestable";
import React from "react";

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

const renderItem = (props) => {
  const { item, collapseIcon, handler } = props;
  return (
    <div style={{ ...nestItem }}>
      {handler}
      {collapseIcon}
      <div style={{ ...nestItemText }}>
        {item.name} &nbsp;&nbsp;
        <small>{item.url}</small>
      </div>
      <div style={{ ...nestItemRight }}>
        {item.weight}
      </div>
    </div>
  );
};

class Nest extends React.Component {

  render() {
    return (
      <div className="justified">
        <Nestable
          collapsed={false}
          maxDepth={4}
          items={this.props.items}
          handler={<Handler />}
          renderItem={renderItem}
          onChange={this.props.onChange}
          renderCollapseIcon={({ isCollapsed }) => (<Collapser isCollapsed={isCollapsed} />)}
        />
      </div>
    )
  }
}

export default Nest;