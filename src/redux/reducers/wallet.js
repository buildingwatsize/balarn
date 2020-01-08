// #############
// ## REDUCER ##
// #############

const initialState = {
  flagEventEditWalletName: false,
  numberOfWallet: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_FLAG_UPDATE_WALLET_NAME": // FOR TOGGLE THE EVENT CALL WALLET API
      return {
        ...state,
        flagEventEditWalletName: !state.flagEventEditWalletName
      }
    case "SET_NUMBER_OF_WALLET":
      return {
        ...state,
        numberOfWallet: action.payload
      }

    default:
      return state
  }
}

// ####################
// ## ACTION CREATOR ##
// ####################

export const actions = {
  setFlagUpdateWallet: () => ({
    type: "SET_FLAG_UPDATE_WALLET_NAME"
  }),
  setNumberOfWallet: (number) => ({
    type: "SET_NUMBER_OF_WALLET",
    payload: number
  }),
}