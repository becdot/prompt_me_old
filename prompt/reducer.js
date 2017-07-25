import { combineReducers } from 'redux';



const todos = (todos = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...todos, { text: action.text, completed: false }];
    case TOGGLE_TODO:
      return todos.map((todo, index) => {
          if (index === action.index) {
            return Object.assign({}, todo, { completed: !todo.completed});
          }
          return todo;
      });
    default:
      return todos;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

export default todoApp;
