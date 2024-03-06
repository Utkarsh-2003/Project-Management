// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import your userSlice reducer

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers as needed
});

export default rootReducer;
