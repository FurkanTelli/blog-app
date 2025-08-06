// App.js
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/NavbarComponent/Navbar';
import Authentication from './components/AuthComponent/Authentication';
import WelcomePage from './components/WelcomePageComponent/WelcomePage';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSideBarOpen } from './store/LoginReducer';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import Blogs from './components/BlogsComponent/Blogs';
import BlogCreate from './components/CreateBlogComponent/BlogCreate';
import AccountComponent from './components/AccountComponent/AccountComponent';

function App() {
  const store = useSelector(state => state.loginStore)
  const dispatch = useDispatch();
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.isLogin === false) {
      toast.current.show({ severity: 'info', summary: 'Signed out', detail: 'User logged out', life: 3000 });
      navigate("/")
    } else {
      toast.current.show({ severity: 'success', summary: 'Logged in', detail: 'User logged in', life: 3000 });
    }
  }, [store.isLogin])

  return (
    <div className={store.isLogin ? "AppLogged" : "AppNotLogged"}>
      <Toast ref={toast} />
      {!store.isLogin && <Authentication />}
      {store.isLogin && <>
        <Navbar />
        <AnimatePresence>
          <motion.div
            className="content"
            animate={{ marginLeft: store.isSideBarOpen ? 20 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {!store.isSideBarOpen && (
                <Button icon="pi pi-arrow-right" onClick={() => dispatch(setIsSideBarOpen(true))} />
              )}
              {!store.isSideBarOpen ? (
                <div style={{ marginLeft: "40%" }}><h1>{store.component}</h1></div>
              ) : (
                <div style={{ width: "100%" }}><h2>{store.component}</h2><hr /></div>
              )}
            </div>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/allBlogs" element={<Blogs />} />
              <Route path="/create" element={<BlogCreate />} />
              <Route path="/account" element={<AccountComponent />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </>}
    </div>
  );
}

export default App;
