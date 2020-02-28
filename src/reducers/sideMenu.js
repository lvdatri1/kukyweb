const afterLogin = [
  {
    name: "Profile",
    screen: "UserProfile",
    icon: "person",
    iconType: "MaterialIcons",
    param: {
      // userId: 1
    }
  },
  {
    screen: "ChatControl",
    name: "Message",
    icon: "md-chatboxes",
    iconType: "Ionicons"
  },
  { screen: "Wallet", name: "Wallet", icon: "wallet", iconType: "Entypo" },
  {
    screen: "Settings",
    name: "Settings",
    icon: "md-settings",
    iconType: "Ionicons"
  }
];
const beforeLogin = [
  {
    name: "Login",
    screen: "Welcome",
    icon: "home",
    iconType: "MaterialCommunityIcons"
  },
  {
    screen: "Settings",
    name: "Settings",
    icon: "md-settings",
    iconType: "Ionicons"
  }
  // {
  //   name: "Profile",
  //   screen: "UserProfile",
  //   icon: "person",
  //   iconType: "MaterialIcons",
  //   param: {
  //     // userId: 1
  //   }
  // },
  // { screen: "Wallet", name: "Wallet", icon: "wallet", iconType: "Entypo" },
  // {
  //   screen: "ChatControl",
  //   name: "Message",
  //   icon: "md-chatboxes",
  //   iconType: "Ionicons"
  // }
];
const sideMenu = (state = beforeLogin, action) => {
  switch (action.type) {
    case "RESET_MENU":
      return beforeLogin;
    case "LOGGED_MENU":
      return afterLogin;
    case "LOGOUT_MENU":
      return beforeLogin;
    default:
      return state;
  }
};
export default sideMenu;
