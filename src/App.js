import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "@/utils/history";
import React from "react";
import { lazy, Suspense } from 'react'

import AuthComponent from "@/components/AuthComponent";
import './App.css';

const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))
const MainLayout = lazy(() => import('./pages/Layout'))

function App() {
  return (
      // 路由配置
      <HistoryRouter history={history}>
        <div className="App">
            <Suspense
                fallback={
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 200
                        }}
                    >
                        loading...
                    </div>
                }
            >
                <Routes>
                    {/* 创建路由path和组件对应关系 */}
                    {/* Layout需要鉴权处理 */}
                    <Route path='/' element={<AuthComponent><MainLayout /></AuthComponent>}>
                        <Route index element={<Home></Home>}></Route>
                        <Route path="article" element={<Article></Article>}></Route>
                        <Route path="publish" element={<Publish></Publish>}></Route>
                    </Route>
                    {/* 这个不需要鉴权处理 */}
                    <Route path='/login' element={<Login />}/>
                </Routes>
            </Suspense>
        </div>
      </HistoryRouter>
  );
}

export default App;
