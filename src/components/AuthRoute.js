//封装高阶组件
//逻辑：
//有token 正常跳转
//无token 去登录
import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

export function AuthRoute({children}) {
    const token = getToken()
    if(token) {
        return <>{children}</>
    } else {
        //用一个重定向组件
        return <Navigate to={'/login'} replace/>
    }
}