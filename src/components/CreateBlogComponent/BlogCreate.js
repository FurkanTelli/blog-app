import React, { useEffect, useRef, useState } from 'react';
import "./Style.css";
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllBlogs } from '../../store/LoginReducer';
import { Panel } from 'primereact/panel';



const BlogCreate = () => {
    const store = useSelector(state => state.loginStore);
    const dispatch = useDispatch();
    const [user, setUser] = useState({});
    const [blog, setBlog] = useState({ id: 0, title: "", topics: [], content: "", show: false, topic: "" });
    const [error, setError] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const myUser = await axios.get(`http://localhost:3001/users/${store.userId}`);
                await setUser(myUser.data)
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [])


    useEffect(() => {
        if (blog.topics.length >= 5) {
            toast.current.show({ severity: 'warn', summary: 'Info', detail: 'You can add a maximum of 5 topics', life: 3000 });
        }
    }, [blog.topics])

    const inputHandlerToCreate = (val, type) => {
        setBlog((prev) => ({
            ...prev,
            [type]: val
        }))
    }

    const addTopic = () => {
        if (blog.topics.includes(blog.topic)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'A topic with this name already exists', life: 3000 });
        } else {
            setBlog((prev) => ({
                ...prev,
                topics: [...prev.topics, prev.topic],
                topic: ""
            }))
        }

    }

    const handleRemoveTopic = (value) => {
        setBlog((prev) => ({
            ...prev,
            topics: prev.topics.filter((e) => e !== value)
        }));
    };

    const createBlog = async () => {
        const isItUniqueTitle = user.blogs.find((element) => element.title === blog.title)

        if (isItUniqueTitle !== undefined) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'There is already a blog on this title', life: 3000 });
        } else {
            let maxId = 0;

            for (let i = 0; i < user.blogs.length; i++) {
                if (user.blogs[i].id > maxId) {
                    maxId = user.blogs[i].id;
                }
            }

            const newId = maxId + 1;

            await user.blogs.push({
                id: newId,
                title: blog.title,
                topics: blog.topics,
                content: blog.content
            })
            try {
                const updateBlogArr = await axios.put(`http://localhost:3001/users/${store.userId}`, user);
                dispatch(setAllBlogs(updateBlogArr.data.blogs))
                toast.current.show({ severity: 'success', summary: 'Added', detail: 'A new blog has been added', life: 3000 });
            } catch (error) {
                console.log(error)
            }
        }


    }

    return (
        <motion.div className="allcards flex justify-content-center"
            // style={store.isSideBarOpen ? {gridTemplateColumns:"repeat(2,1fr)"} : {gridTemplateColumns:"repeat(3,1fr)"}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <Toast ref={toast} />
            <Panel header="Blog">
                <div className="create-input-form">
                    {/* <div className='id-div'>
                    <label htmlFor="id">Id:</label>
                    <InputNumber value={blog.id} disabled />
                </div> */}
                    <div className='title-div'>
                        <label htmlFor="title">Title:</label>
                        <InputText value={blog.title} onChange={(e) => inputHandlerToCreate(e.target.value, "title")} />
                    </div>
                    <label htmlFor="topic">Topic:</label>
                    <div className="topic-div">
                        {/* <InputText placeholder="Add topic" id="spacekey" keyfilter={/[^s]/} value={blog.topic} onChange={(e) => inputHandlerToCreate(e.target.value, "topic")} /> */}
                        <InputText
                            placeholder="Add topic"
                            value={blog.topic}
                            onChange={(e) => inputHandlerToCreate(e.target.value, "topic")}
                            onKeyDown={(e) => {
                                if (e.key === " ") {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <Button icon="pi pi-check" className="p-button-success" disabled={blog.topics.length >= 5 || !blog.topic.length} onClick={addTopic} />
                        <Button icon="pi pi-refresh" className="p-button-danger" disabled={!blog.topics.length} onClick={() => setBlog((prev) => ({ ...prev, topics: [] }))} />
                    </div>
                    <div className={!blog.topics.length ? "none" : "topics-div"}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }} >
                        {
                            blog.topics.map((element) => (
                                <div initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}>
                                    <Chip label={element} style={{ cursor: "pointer" }} onClick={() => handleRemoveTopic(element)} />
                                </div>
                            ))
                        }
                    </div>
                    <div className='content-div'>
                        <label htmlFor="content">Content:</label>
                        {/* <InputText value={showEditableBlog.content} onChange={(e) => updateInputHandler(e.target.value, "content")} /> */}
                        <InputTextarea value={blog.content} onChange={(e) => inputHandlerToCreate(e.target.value, "content")} rows={5} cols={30} />
                    </div>
                    <Button label="Add" disabled={!blog.title.length || !blog.content.length} severity="success" onClick={createBlog} />
                </div>
            </Panel>
        </motion.div >
    )
}

export default BlogCreate