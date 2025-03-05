//编写store

import {createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const foodsStore = createSlice({
    name:'foods',
    initialState:{
        //商品列表
        foodsList:[],
        //菜单激活值下标值
        activeIndex: 0,
        //购物车列表
        cartList:[]
    },
    reducers:{
        //更改商品列表
        setFoodsList (state, action) {
            state.foodsList = action.payload
        },
        //更改activeIndex
        changeActiveIndex (state, action) {
            state.activeIndex = action.payload
        },
        //添加购物车
        addCart (state, action) {
            //要判断是否添加过？以action.payload.id去cartList匹配查找
            const item = state.cartList.find(item => item.id === action.payload.id)
            if(item){
                item.count ++
            } else {
                //保证了count字段的存在
                state.cartList.push({...action.payload, count:1})
            }
        }
    }
})

//异步获取
const {setFoodsList, changeActiveIndex, addCart} = foodsStore.actions

const fetchFoodsList = () => {
    //编写异步逻辑
    return async (dispatch) => {
        const res = await axios.get('http://localhost:3004/takeaway')
        //调用dispatch函数提交action
        dispatch(setFoodsList(res.data))
    }
}

export { fetchFoodsList, changeActiveIndex, addCart }

const reducer = foodsStore.reducer

export default reducer