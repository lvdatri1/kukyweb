// import {Dimensions, Platform, Alert, Linking} from 'react-native';
import { store } from "../App";

const countries = [
  { name: "vietnam", code: "+84", language: "vietnamese" },
  { name: "australia", code: "+61", language: "english" },
  { name: "china", code: "+86", language: "chinese" },
  { name: "new zealand", code: "+64", language: "english" },
  { name: "united states", code: "+1", language: "english" }
];
const CONSTANTS = {
  SEND_BIRD: {
    APP_ID: "19DAE590-E41F-4652-B9FF-D0C763C78C5C",
    API_TOKEN: "be3bd2652bf68c099a9c0130792c1ba67dde31a4",
    API_URL: "https://api-19DAE590-E41F-4652-B9FF-D0C763C78C5C.sendbird.com"
  },
  SERVER_API: "https://mobile.kuky.com/prod/api/", //move to prod
  // SERVER_API: "https://ejrqioc4of.execute-api.ap-southeast-2.amazonaws.com/dev/api/",
  // SERVER_API: 'http://localhost:4000/api/',
  // GOOGLE_API_KEY: "AIzaSyAwYHrxViZiuALJTUUaPs6xhyNvmP-6u3E",
  GOOGLE_API_KEY: "AIzaSyAkZBki5wLgZ0rhtjtnGTyvXuvVP5ZZshY",
  DEFAULT_AVATAR: "https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/default-avatar.png",
  DEFAULT_VIDEO_ICON: "https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/video_player.png",
  DEFAULT_BG: "https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/side_bg.png",
  RANDOM_IMAGE: "https://picsum.photos/200",
  GENERATE_QR_CODE_API: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=",
  OS: "web",
  OS_VERSION: "xxx",
  HEIGHT: 900,
  WIDTH: 1024,
  WIDTH_RATIO: 1,
  getTimeDifference: timeDifference,
  MY_SHADOW_STYLE: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17
  },
  MY_FONT_COLOR: "#414042",
  MY_BLUE: "#0075FF",
  MY_PURPLE: "#5918E8",
  MY_GRAYBG: "#F3F4F4",
  MY_GREY: "#939598",
  MY_PINK: "#E657EB",
  MY_HEAD_TITLE_COLOR: "#000000",
  MY_BLACK_BORDER: "#414042",
  MY_FONT_SIZE_NORMAL: 14,
  MY_FONT_SIZE_NORMAL_2: 18,
  MY_FONT_FAMILY_BOLD: "Montserrat-SemiBold",
  MY_FONT_FAMILY_LIGHT: "Montserrat-Light",
  MY_FONT_FAMILY_DEFAULT: "Montserrat-Regular",
  MY_FONT_FAMILY_MEDIUM: "Montserrat-Medium",
  MY_FONT_HEADER_1_SIZE: 36,
  MY_FONT_HEADER_2_SIZE: 22,
  MY_FONT_HEADER_1_WEIGHT: 200,
  MY_FONT_HEADER_2_WEIGHT: 400,
  COUNTRY_LIST: countries,
  CARD_LOGOS: {
    visa: require("../assets/xd/Icons/visa.png"),
    mastercard: require("../assets/xd/Icons/mastercard.png"),
    jcb: require("../assets/xd/Icons/jcb.png"),
    maestro: require("../assets/xd/Icons/mastertro.png"),
    discover: require("../assets/xd/Icons/Discover.png"),
    "american-express": require("../assets/xd/Icons/american-express.png")
  },
  SPARE_HEADER: 0,
  SPARE_FOOTER: 0,
  renderListPeople: (people: any) => {
    let result: string = "";
    if (people.length == 0) return "Nobody";
    if (people.length > 0)
      people.forEach((element: any, index: any) => {
        if (index < 2 && index != people.length - 1) result = result + element + ", ";
        if (index < 2 && index == people.length - 1) result = result + element + " ";
        if (index === 2) result = result + "and " + (people.length - 2).toString() + " others";
      });
    return result;
  },

  DEFAULT_ERROR_CALL_BACK: (err: any) => {
    const state = store.getState(); //connect to global store of redux
    if (err.response) {
      alert(err.response.data.message);
      if (err.response.data.status === 403) {
        //need to go to login if 403
        store.dispatch({ type: "USER_LOGOUT" });
        store.dispatch({ type: "LOGOUT_MENU" });
        state.user.reactNavigation.navigate("Welcome");
      }
    } else {
      alert(err.toString());
    }
  },
  GENERATE_RANDOM: (max: any) => Math.floor(Math.random() * Math.floor(max))
};
export default CONSTANTS;

function timeDifference(previous: any, currentTime = Date.now()) {
  let current = currentTime;
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  //worked with unix or normal date time
  var elapsed;
  if (Number.isInteger(previous)) {
    elapsed = current - previous;
  } else elapsed = current - Date.parse(previous);

  if (elapsed < msPerMinute) {
    return "now";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "about " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "about " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "about " + Math.round(elapsed / msPerYear) + " years ago";
  }
}
