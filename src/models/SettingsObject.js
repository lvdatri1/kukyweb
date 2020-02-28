class SettingsObject {
  constructor() {
    this.fullName = "Luat"; //: "Vietnam",
    this.avatarUrl = ""; //: "Vietnam",
    this.backgroundUrl = ""; //: "Vietnam",
    this.introduction = ""; //: "Vietnam",
    this.country = "Vietnam"; //: "Vietnam",
    this.language = "vietnamese"; //: "english|vietnamese",
    this.accountType = "individual"; //: "individual|business",
    this.over18 = true; //: "yes|no",
    this.gender = "male";
    this.subscribeToAdultContent = true; //: "yes|No",
    this.preferredCurrency = "USD"; //: "VND|AUD|xxxx",
    this.exchangeRate = "110"; //: 11, // (LTC to PreferCurrency),
    // this.accounts = [];// [accountObject, accountObject], //  (first one is
    // default),
    // Phone: ["+862222", "+22343535"], // (first one is default),
    this.contactType = "email"; //: "phone/email"
  }
}

module.exports = SettingsObject;
