const initialState = {
  // todos: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    // case 'ADD_TODO':
    //   return {
    //     ...state,
    //     todos: [
    //       ...state.todos,
    //       {
    //         id: action.id,
    //         text: action.text,
    //         completed: false
    //       }
    //     ]
    //   }

    // case 'TOGGLE_TODO':
    //   return {
    //     ...state,
    //     todos: state.todos.map(todo =>
    //       todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
    //     )
    //   }

    // case 'REMOVE_TODO':
    //   return {
    //     ...state,
    //     todos: state.todos.filter(todo =>
    //       todo.id !== action.id
    //     )
    //   }

    default:
      return state
  }
}

// ####################
// ## ACTION CREATOR ##
// ####################

// let nextTodoId = 0
export const actions = {
  // addTodo: (text) => ({
  //   type: 'ADD_TODO',
  //   id: nextTodoId++,
  //   text
  // }),
  // toggleTodo: (id) => ({
  //   type: 'TOGGLE_TODO',
  //   id
  // }),
  // removeTodo: (id) => ({
  //   type: 'REMOVE_TODO',
  //   id
  // })
}