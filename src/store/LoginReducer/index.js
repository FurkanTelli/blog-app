import { createSlice } from "@reduxjs/toolkit";


export const loginSlice = createSlice({
    name:"loginRedux",
    initialState: {
        isLogin:false,
        whoLoggedIn:"",
        userId:0,
        userBlogs:[],
        isSideBarOpen:true,
        component:"Welcome"
    },
    reducers: {
        setIsLogin:(state,action) => {
            state.isLogin = action.payload;
        },
        setWhoLoggedIn: (state,action) => {
            state.whoLoggedIn = action.payload.username;
            state.userId = action.payload.userId;
        },
        setAllBlogs:(state, action) => {
            state.userBlogs = action.payload;
        },
        setIsSideBarOpen: (state, action) => {
            state.isSideBarOpen = action.payload;
        },
        setComponent: (state, action) => {
            state.component = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.whoLoggedIn = "";
            state.userId = 0
        }
    }
});

export const { setIsLogin, setWhoLoggedIn, setAllBlogs, setIsSideBarOpen, setComponent, logout } = loginSlice.actions;

export default loginSlice.reducer;