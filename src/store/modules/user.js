//和用户相关的状态管理

import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";

const userStore = createSlice({
    name: "user",
    //数据状态
    initialState:{
        //从本地先去取取看，实现了持久化
        token:localStorage.getItem('token_key') || ''
    },
    //同步修改方法
    reducers:{
        setToken(state, action) {
            state.token = action.payload
            //在本地localStorage也存一份
            localStorage.setItem('token_key', action.payload)
        }
    }
})

//解构actionCreater

const {setToken} = userStore.actions

//获取reducer函数

const userReducer = userStore.reducer

// 异步方法 完成登录获取token

const fetchLogin = (loginForm) => {
    return async (dispatch)=>{
        //发送异步请求
        const res = await request.post('/authorizations', loginForm)
        //提交同步action进行token存入
        dispatch(setToken(res.data.token))
    }
}

export { fetchLogin, setToken }
export default userReducer