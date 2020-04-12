import {
  CHANGE_EMAIL_INPUT,
  CHANGE_PASSWORD_INPUT,
  HANDLE_LOGIN_ACTION,
} from "../actions/action.js";



const initialState = {
  inputEmail: "",
  inputPassword: "",
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_EMAIL_INPUT: {
      const inputEmail = action.event.target.value;

      return {
        ...state,
        inputEmail,
      };
    }

    case CHANGE_PASSWORD_INPUT: {
      const inputPassword = action.event.target.value;

      return {
        ...state,
        inputPassword,
      };
    }

    case HANDLE_LOGIN_ACTION: {
        const 
    }

    default:
      return state;
  }
};

export default loginReducer;
