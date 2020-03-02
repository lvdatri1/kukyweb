const people = (state = { people: [], peopleLen: 0, isLoading: false }, action: any) => {
  // console.log('state is out', state.people);
  switch (action.type) {
    case "RESET_PEOPLE":
      return { people: [], peopleLen: 0, isLoading: true };
    case "REQUEST_PEOPLE":
      return { ...state, isLoading: true };
    case "RECEIVE_PEOPLE": {
      console.log("state is new", action);
      return {
        ...state,
        people: state.people.concat(action.data),
        isLoading: false,
        peopleLen: state.people.concat(action.data).length
      };
    }
    default:
      return state;
  }
};
export default people;
