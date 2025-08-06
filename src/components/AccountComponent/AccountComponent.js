import React, { useEffect, useRef, useState } from 'react'
import "../AccountComponent/Style.css"
import { motion } from 'framer-motion';
import { Panel } from 'primereact/panel';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAllBlogs, setComponent, setIsLogin, setWhoLoggedIn } from '../../store/LoginReducer';


const AccountComponent = () => {
    const store = useSelector(state => state.loginStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [visible, setVisible] = useState({ show: false, type: "" });
    const [changeUserInfo, setChangeUserInfo] = useState({ username: "", password: "", confirmPassword: "" });
    const [user, setUser] = useState({})


    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await axios.get(`http://localhost:3001/users/${store.userId}`);
                setUser(user.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [])


    const accountPanelHeader = () => {
        return (
            <div className='account-panel-header'>
                <Button icon="pi pi-pencil" severity="info" onClick={() => setVisible(() => ({ type: "edit", show: true }))} />
                <Button label="Delete" severity="danger" icon="pi pi-trash" onClick={() => setVisible(() => ({ type: "delete", show: true }))} />
            </div>
        )
    }

    const deleteUser = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/users/${store.userId}`);
            console.log(response);
            await navigate("/");
            dispatch(setIsLogin(false));
            dispatch(setWhoLoggedIn({ username: "".username, userId: 0 }));
            dispatch(setComponent(""));
            dispatch(setAllBlogs([]))
        } catch (error) {
            console.log(error);
        }
    }

    const editUser = async () => {
        const updateUserInfo = {
            ...user,
            username: changeUserInfo.username,
            password: changeUserInfo.password
        };
        console.log(updateUserInfo)

        const isEmptyAnyField = Object.values(changeUserInfo).some((e) => e === "")
        if (changeUserInfo.confirmPassword !== changeUserInfo.password) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: "Passwords do not match", life: 3000 });
        } else if (isEmptyAnyField) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: "Please fill in all fields", life: 3000 });
        } else {
            try {
                const response = await axios.put(`http://localhost:3001/users/${store.userId}`, updateUserInfo);
                console.log(response);
                if(response.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Updated', detail: "The update has been completed.", life: 3000 });
                    dispatch(setWhoLoggedIn(""));
                    dispatch(setIsLogin(false));
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    const cancelDialog = () => {
        setVisible(() => ({ type: "", show: false }))
        setChangeUserInfo(() => ({ username: "", password: "", confirmPassword: "" }));
    }

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={cancelDialog} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={visible.type === "delete" ? deleteUser : editUser} autoFocus />
        </div>
    );



    const handleInput = (val, type) => {
        setChangeUserInfo((prev) => ({
            ...prev,
            [type]: val
        }))
    };



    return (
        <motion.div initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <Toast ref={toast} />
            <Panel header={accountPanelHeader} className='account-panel'>
                <div className="account-div">
                    <h3 htmlFor="username">User ID:</h3>
                    <InputText id="username" disabled value={store.userId} aria-describedby="username-help" />
                </div>
                <div className='account-div'>
                    <h3>Username:</h3>
                    <InputText id="username" disabled value={store.whoLoggedIn} aria-describedby="username-help" />
                </div>
            </Panel>
            <Dialog header="Header" visible={visible.show} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} footer={footerContent}>
                {visible.type === "delete" ?
                    <p className="m-0">
                        Are you sure you want to delete your account?
                    </p>
                    : <div>
                        <div className="edit-user-div">
                            <label htmlFor="username">Username</label>
                            <InputText id="username" value={changeUserInfo.username} onChange={(e) => handleInput(e.target.value, "username")} />
                        </div>
                        <div className="edit-user-div">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" value={changeUserInfo.password} onChange={(e) => handleInput(e.target.value, "password")} />
                        </div>
                        <div className="edit-user-div">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <InputText id="confirmPassword" value={changeUserInfo.confirmPassword} onChange={(e) => handleInput(e.target.value, "confirmPassword")} />
                        </div>
                    </div>}
            </Dialog>
        </motion.div>
    )
}

export default AccountComponent