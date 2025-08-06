import React, { useEffect } from 'react'
import "./Style.css";
import { motion } from 'framer-motion';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllBlogs } from '../../store/LoginReducer';


const WelcomePage = () => {
    const store = useSelector(state => state.loginStore);
    const dispatch = useDispatch();


    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const user = await axios.get(`http://localhost:3001/users/${store.userId}`);
                dispatch(setAllBlogs(user.data.blogs));
            } catch (error) {
                console.error("Kullanıcı bilgisi alınamadı:", error);
            }
        };
        getUserInfo()
    }, [store.whoLoggedIn])


    return (
        <motion.div
            className="allcards flex justify-content-center"
            // style={store.isSideBarOpen ? {gridTemplateColumns:"repeat(2,1fr)"} : {gridTemplateColumns:"repeat(3,1fr)"}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >   <Panel header="About Project">
                <p>
                    Hello, welcome to the blogging project. Here, you can view your existing blogs, edit them, create new ones, and even delete them.
                    You can manage and access your blogs from the drop-down menu on the left.You can also edit your account information externally.
                    You can also add topic headings to your existing blogs.
                </p>
                <p>
                    This blog project currently uses a fake API. You can view the db.json file within the project. Updates are made using the data in this fake API.
                </p>
            </Panel>
        </motion.div>
    )
}

export default WelcomePage