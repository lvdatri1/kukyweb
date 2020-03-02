import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class WelcomePage extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">Welcome To Kuky</div>
        </div>
        <div className="row">
          <div className="col">1 of 3</div>
          <div className="col-5">2 of 3 (wider)</div>
          <div className="col">3 of 3</div>
        </div>
      </div>
    );
  }
}
