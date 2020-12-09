import React, { Component } from "react";

  
  class Header extends Component {
    render(){
  return (<>
    <div style={{backgroundColor:"#D09090", marginBottom: "2%", height:"10%" }}>
     <div className="back" style={{ marginLeft: "5%"}}><li id="a">Back to main page</li></div>
    </div>
    </>
  );
}
  }
export default Header;