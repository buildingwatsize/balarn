import jwtDecode from 'jwt-decode'
import { TOKEN } from '../../config/constants'

// #############
// ## REDUCER ##
// #############

const initialState = () => {
  const token = sessionStorage.getItem(TOKEN);
  if (token) {
    return jwtDecode(token)
  } else {
    return {
      role: "guest"
    }
  }
}

export default (state = initialState(), action) => {
  switch (action.type) {
    case "SIGNIN":
      const token = action.payload.token
      // console.log(token)
      const user = jwtDecode(token)
      // console.log(user)
      sessionStorage.setItem(TOKEN, token)
      return {
        ...state,
        role: user.role
      }

    case "SIGNOUT":
      sessionStorage.removeItem(TOKEN)
      // window.appHistory.push('/')
      return {
        ...state,
        role: "guest"
      }

    default:
      return state
  }
}

// ####################
// ## ACTION CREATOR ##
// ####################

export const actions = {
  signin: (token) => {
    return {
      type: "SIGNIN",
      payload: {
        token
      }
    }
  },
  signout: () => ({ type: "SIGNOUT" }),
}