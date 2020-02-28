const UserObject = require("./UserObject");

class NotificationObject {
  constructor() {
    this.user = new UserObject();
    this.id = 124; // removed User, as we only get notification from the user
    this.title = "left you a comment";
    this.summary = "abc";
    this.createdAt = "2019-04-23 20:30:56";
    this.type = "";// "commented|commentTagged|posted|postTagged|sendMoney|receiveMoney", //we will define later, but right now we could he:
    this.link = ""; //use for router and deeplink: -> /post/{id} message/{id}
    this.media = [];// [MediaObject],
    this.status = "new|opened|deleted"; //to make sure that we still keep

  }
}

module.exports = NotificationObject;
