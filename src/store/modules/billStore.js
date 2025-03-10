//账单列表相关store

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const billStore = createSlice({
    name:'bill',
    //定义数据状态state
    initialState:{
        billList:[]
    },
    reducers:{
        //同步修改方法
        setBillList(state, action) {
            state.billList = action.payload
        }
    }
})

//解构actionCreate函数
const {setBillList} = billStore.actions
//编写异步
const getBillList = () => {
    //编写异步逻辑
    return async (dispatch) => {
        const res = await axios.get('http://localhost:8888/ka')
        //触发同步reducer
        dispatch(setBillList(res.data))
    }
}

export {getBillList}
//导出reducer
const reducer = billStore.reducer

export default reducer