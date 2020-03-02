// import SplashScreen from '../screens/SplashScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import DiscoverScreen from '../screens/DiscoverScreen';
import SideMenuLive from '../components/SideMenu';
import PeopleListScreen from '../screens/PeopleListScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginViaEmailScreen from '../screens/LoginViaEmailScreen';
import LoginViaSMSScreen from '../screens/LoginViaSMSScreen';
import ActivationCodeScreen from '../screens/ActivationCodeScreen';
import FirstTimeUserScreen from '../screens/FirstTimeUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CONSTANTS from './PeertalConstants';
import AboutScreen from '../screens/AboutScreen';
import TandCScreen from '../screens/TandCScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import FAQScreen from '../screens/FAQScreen';
import ContactScreen from '../screens/ContactScreen';
import ReportProblemScreen from '../screens/ReportProblemScreen';
import MapViewScreen from '../screens/MapViewScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import MainChatScreen from '../screens/MainChatScreen';
import ChatControlScreen from '../screens/ChatControlScreen';
import SearchScreen from '../screens/SearchScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import LinkNewBankScreen from '../screens/LinkNewBankScreen';
import CashOutStep1Screen from '../screens/CashOutStep1Screen';
import RequestMoneyScreen from '../screens/RequestMoneyScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import SuccessActionScreen from '../screens/SuccessActionScreen';
import UpdatePostScreen from '../screens/UpdatePostScreen';
import SendRequestMoneyScreen from '../screens/SendRequestMoneyScreen';
import CashOutActionScreen from '../screens/CashOutActionScreen';
import TopUpStep1Screen from '../screens/TopUpStep1Screen';
import LinkCreditCardScreen from '../screens/LinkCreditCardScreen';
import FilterProfileScreen from '../screens/FilterProfileScreen';
const MainDrawer = createDrawerNavigator(
  {
    Discover: {
      screen: DiscoverScreen,
    },
    PeopleList: {
      screen: PeopleListScreen,
    },
    ChatControl: {
      screen: ChatControlScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Notification: {screen: NotificationScreen},
    PrivacyPolicy: {
      screen: PrivacyPolicyScreen,
    },
    About: {
      screen: AboutScreen,
    },
    MapView: {
      screen: MapViewScreen,
    },

    FAQ: {
      screen: FAQScreen,
    },
    Contact: {
      screen: ContactScreen,
    },
    BackToLogin: {
      screen: WelcomeScreen,
    },
    UserProfile: {
      screen: UserProfileScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
    Wallet: {
      screen: WalletScreen,
    },
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'none',
    contentComponent: SideMenuLive,
    drawerWidth: (305 * CONSTANTS.WIDTH) / 375, //80% of screen Width
  },
);

//Main Stack is here.....:) -> change the initial RouteName below
const LoginStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
    },
    LoginViaEmail: {
      screen: LoginViaEmailScreen,
    },
    LoginViaSMS: {
      screen: LoginViaSMSScreen,
    },
    ActivationCode: {
      screen: ActivationCodeScreen,
    },
    FirstTimeUser: {
      screen: FirstTimeUserScreen,
    },
    MainFlow: {
      screen: MainDrawer,
    },
    UserProfile: {
      screen: UserProfileScreen,
    },
    MainChat: {
      screen: MainChatScreen,
    },
    ChatControl: {
      screen: ChatControlScreen,
    },
    PostDetails: {
      screen: PostDetailsScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    LinkNewBank: {
      screen: LinkNewBankScreen,
    },
    CashOutStep1: {
      screen: CashOutStep1Screen,
    },
    CashOutAction: {
      screen: CashOutActionScreen,
    },
    TopUpStep1: {
      screen: TopUpStep1Screen,
    },
    LinkCreditCard: {
      screen: LinkCreditCardScreen,
    },
    RequestMoney: {
      screen: RequestMoneyScreen,
    },
    SendMoney: {
      screen: SendMoneyScreen,
    },
    SendRequestMoney: {
      screen: SendRequestMoneyScreen,
    },
    SuccessAction: {
      screen: SuccessActionScreen,
    },
    UpdatePost: {
      screen: UpdatePostScreen,
    },
    TandC: {
      screen: TandCScreen,
    },
    ReportProblem: {
      screen: ReportProblemScreen,
    },
    FilterProfile: {
      screen: FilterProfileScreen,
    },
  },
  {
    initialRouteName: 'MainFlow', //Change here to test.....!!!-> set to "MainFlow" to post direct
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: true, //make sure only happen in few screen
    },
  },
);
const LoginContainer = createAppContainer(LoginStack);

// export default RootStack;
export default LoginContainer;
