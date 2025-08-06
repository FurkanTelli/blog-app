import { Menubar } from 'primereact/menubar';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import "./Style.css";
import { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { setComponent, setIsLogin, setIsSideBarOpen, setWhoLoggedIn } from '../../store/LoginReducer';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const sideBarOpen = useSelector(state => state.loginStore.isSideBarOpen);
    const username = useSelector(state => state.loginStore.whoLoggedIn);
    const dispatch = useDispatch();
    const toast = useRef(null);
    const navigate = useNavigate();


    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                dispatch(setComponent("Welcome"))
                navigate("/");
            }
        },
        {
            label: 'Create Blog',
            icon: 'pi pi-plus',
            command: () => {
                dispatch(setComponent("Create Blog"))
                navigate("/create");
            }
        },
        {
            label: 'View Blogs',
            icon: 'pi pi-book',
            command: () => {
                dispatch(setComponent("View Blog"))
                navigate("/allBlogs");

            }
        },
         {
            label: 'Account',
            icon: 'pi pi-user',
            command: () => {
                dispatch(setComponent("Account"))
                navigate("/account");
            }
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
                 dispatch(setIsLogin(false))
                 dispatch(setWhoLoggedIn(""))
            }
        }
    ];

    return (
        <AnimatePresence>
            {sideBarOpen && (
                <motion.div
                    className='sideBar'
                    initial={{ x: -300, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}  
                    exit={{ x: -300, opacity: 0 }} 
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                    <div>
                        <div className='sideBar-header'>
                            <h1>{username}</h1>
                        </div>
                        <div className="card flex justify-content-center">
                            <PanelMenu model={items} className="w-full md:w-20rem" />
                            <Toast ref={toast} />
                        </div>
                    </div>
                    <div className='sideBar-footer'>
                        <Button
                            label="Hide Menu"
                            icon="pi pi-arrow-circle-left"
                            onClick={() => dispatch(setIsSideBarOpen(false))}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Navbar