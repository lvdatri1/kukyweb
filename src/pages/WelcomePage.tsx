import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class WelcomePage extends Component {
  render() {
    return (
      <div>
        Welcome to Kuky
        <div>
          <Link to="/">go back to home</Link>
        </div>
      </div>
    );
  }
}
