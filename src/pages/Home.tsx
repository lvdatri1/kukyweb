import React, { Component, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class PageProps {
  msg?: string = "I hate you";
}
type myState = {
  msg: string;
};
export default class Home extends Component<PageProps, myState> {
  constructor(props: PageProps) {
    super(props);
    this._goTo = this._goTo.bind(this);
    this.state = {
      msg: props.msg || "I hate"
    };
  }
  _goTo(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    alert(this.state.msg);
    window.location.href = "/welcome";
    return;
  }
  render() {
    return (
      <div>
        <Button onClick={this._goTo}>go back</Button>
        <br></br>
        {this.state.msg}
        <Link to="/welcome">go to welcome</Link>
      </div>
    );
  }
}
