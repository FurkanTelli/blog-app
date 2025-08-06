import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Chip } from 'primereact/chip';
import "./Style.css";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSlice, setComponent, setIsLogin, setWhoLoggedIn } from '../../store/LoginReducer';
import { Toast } from 'primereact/toast';

const Authentication = () => {
    let store = useSelector(state => state.loginStore)
    const dispatch = useDispatch()
    const toast = useRef(null);


    const [registered, setRegistered] = useState(false);
    const [login, setLogin] = useState({ email: "", password: "" });
    const [signUp, setSignUp] = useState({ username: "", email: "", password: "", confirmPassword: "", blogs: [] })
    const [error, setError] = useState({ username: false, email: false, notEqualPassword: false, loginError: false, errorMessages: "" })
    const [isDisabled, setIsDisabled] = useState(false);



    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (registered) {
            setIsDisabled(Object.values(signUp).some(val => val === "") || !emailRegex.test(signUp.email))
        } else {
            setIsDisabled(Object.values(login).some(val => val === "") || !emailRegex.test(login.email))
        }
    }, [login, signUp])


    // useEffect(() => {
    //     console.log(store)
    // }, [store])

    const header = (
        <div>
            <Chip label={!registered ? "Sign Up" : "Login"} className='chip' onClick={() => {
                setRegistered(!registered)
                if (registered) {
                    setSignUp(() => ({
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        blogs: []
                    }))
                } else {
                    setLogin(() => ({
                        email: "",
                        password: ""
                    }))
                }
            }} />
        </div>
    );
    const footer = (
        <>
            <Button label="Submit" icon="pi pi-check"
                onClick={() => registered ? createNewAccount() : createNewAccount()}
                disabled={isDisabled}
            />
        </>
    );

    const handleInputs = (val, field) => {
        if (registered) {
            setSignUp((prev) => ({
                ...prev,
                [field]: val
            }))

        } else {
            setLogin((prev) => ({
                ...prev,
                [field]: val
            }))

        }
    }



    const createNewAccount = async () => {
        try {
            const getUsers = await axios.get("http://localhost:3001/users");
            if (registered) {
                const containSameEmail = await getUsers.data.find(user => (signUp.email) === user.email);
                const containSameUsername = await getUsers.data.find(user => signUp.username === user.username);
                if (containSameEmail !== undefined) {
                    setError(() => ({
                        username: false,
                        notEqualPassword: false,
                        passwordNotTrue: false,
                        email: true,
                        errorMessages: "There is a person with this email address"
                    }))
                    toast.current.show({ severity: 'error', summary: 'Error', detail: "There is a person with this email address", life: 3000 });
                } else if (containSameUsername !== undefined) {
                    setError(() => ({
                        notEqualPassword: false,
                        passwordNotTrue: false,
                        email: false,
                        username: true,
                        errorMessages: "There is a person with this username"
                    }))
                    toast.current.show({ severity: 'error', summary: 'Error', detail: "There is a person with this username", life: 3000 });
                } else if (signUp.password !== signUp.confirmPassword) {
                    setError(() => ({
                        username: false,
                        passwordNotTrue: false,
                        email: false,
                        notEqualPassword: true,
                        errorMessages: "Passwords do not match"
                    }))
                    toast.current.show({ severity: 'error', summary: 'Error', detail:  "Passwords do not match", life: 3000 });
                } else {
                    try {
                        await setError(() => ({
                            username: false,
                            passwordNotTrue: false,
                            email: false,
                            notEqualPassword: false,
                            errorMessages: ""
                        }))
                        const newUser = await axios.post("http://localhost:3001/users", { username: signUp.username, email: signUp.email, password: signUp.password, blogs: signUp.blogs })
                        // console.log(newUser)
                    } catch (error) {
                        console.log(error)
                    }
                }
                if (signUp.username === false && signUp.email === false && signUp.notEqualPassword === false) {
                    setSignUp((prev) => ({
                        ...prev,
                        errorMessages: ""
                    }))

                }
            } else {
                const isMatch = await getUsers.data.find(user => ((user.email === login.email) && (user.password === login.password)))
                // console.log(isMatch)
                if (isMatch !== undefined) {
                    await setError(() => ({
                        username: false,
                        passwordNotTrue: false,
                        email: false,
                        notEqualPassword: false,
                        loginError: false,
                        errorMessages: ""
                    }))
                    dispatch(setIsLogin(true));
                    dispatch(setWhoLoggedIn({ username: isMatch.username, userId: isMatch.id }));
                    dispatch(setComponent("Welcome"));
                } else {
                    await setError((prev) => ({
                        ...prev,
                        loginError: true,
                        errorMessages: "email or password is incorrect"
                    }))
                    toast.current.show({ severity: 'error', summary: 'Error', detail:"email or password is incorrect", life: 3000 });
                }
                // console.log(store)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='main-div'>
            <Toast ref={toast} />
            <div className="card flex justify-content-center advance-card">
                <Card title={!registered ? "Login" : "Sign Up"} footer={footer} header={header} className="md:w-25rem form">
                    {registered ?
                        <>
                            <div className='label-input'>
                                <label htmlFor='username'>Username :</label>
                                <InputText id="username" value={signUp.username} onChange={(e) => handleInputs(e.target.value, "username")} />
                            </div>
                            <div className='label-input'>
                                <label htmlFor='email'>Email :</label>
                                <InputText id="email" value={signUp.email} onChange={(e) => handleInputs(e.target.value, "email")} />
                            </div>
                            <div className='label-input'>
                                <label htmlFor='password'>Password :</label>
                                <InputText id="password" value={signUp.password} onChange={(e) => handleInputs(e.target.value, "password")} />
                            </div>
                            <div className='label-input'>
                                <label htmlFor='confirmPassword'>Confirm Password :</label>
                                <InputText id="confirmPassword" value={signUp.confirmPassword} onChange={(e) => handleInputs(e.target.value, "confirmPassword")} />
                            </div>
                        </>
                        : <>
                            <div className='label-input'>
                                <label htmlFor='email'>Email :</label>
                                <InputText id="email" value={login.email} onChange={(e) => handleInputs(e.target.value, "email")} />
                            </div>
                            <div className='label-input'>
                                <label htmlFor='password'>Password :</label>
                                <InputText id="password" value={login.password} onChange={(e) => handleInputs(e.target.value, "password")} />
                            </div>
                        </>}
                </Card>
            </div>
        </div>
    )
}

export default Authentication