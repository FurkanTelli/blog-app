import React, { useEffect, useRef, useState } from 'react'
import "./Style.css";
import { motion } from 'framer-motion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import { setAllBlogs } from '../../store/LoginReducer';


const Blogs = () => {
    const store = useSelector(state => state.loginStore);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);


    const [user, setUser] = useState({});
    const [blogContent, setBlogContent] = useState("");
    const [showBlogContent, setShowBlogContent] = useState(false);
    const [showEditableBlog, setShowEditableBlog] = useState({ id: 0, title: "", topics: [], content: "", show: false });
    const [blogToBeDeleted, setBlogToBeDeleted] = useState({ id: 0, title: "", topics: [], content: "" });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)


    // useEffect(() => {
    //     //      const getUserInfo = async () => {
    //     //     try {
    //     //         const user = await axios.get(`http://localhost:3001/users/${store.userId}`);
    //     //         dispatch(setAllBlogs(user.data.blogs));
    //     //     } catch (error) {
    //     //         console.error("Kullanıcı bilgisi alınamadı:", error);
    //     //     }
    //     // };
    //     // getUserInfo()
    // }, [allBlogs])

    useEffect(() => {
        if (store.isLogin === false) {
            navigate("/")
        }
    }, [store.isLogin])

    const topicsTemplate = (rowData) => {
        if (!Array.isArray(rowData.topics)) return "";
        const displayedTopics = rowData.topics;
        const hasMore = rowData.topics.length > 3;

        return (
            <div style={{ display: 'inline' }}>
                {displayedTopics.map((element, index) => (
                    <Tag key={index} severity="warning" value={element} style={{ marginRight: "5px" }} />
                ))}
                {hasMore && '...'}
            </div>)
    };

    const contentTemplate = (e) => {
        return (
            <div style={{ display: "flex" }}>
                <Button icon="pi pi-search" style={{ width: "40%" }} onClick={() => {
                    setShowBlogContent(!showBlogContent)
                    setBlogContent(e.content);

                }
                } />
            </div>
        );
    };

    const editBlog = (e) => {
        return (
            <div>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => updateBlogView(e)} />
            </div>
        )
    }

    const deleteBlog = (e) => {
        return (
            <div>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => removeThisBlogView(e)} />
            </div>
        )
    }

    const updateBlogView = async (e) => {
        try {
            const getUser = await axios.get(`http://localhost:3001/users/${store.userId}`);
            let userData = getUser.data;
            setUser(userData)
            let findBlogForUpdate = await userData.blogs.find(element => element.id === e.id)
            setShowEditableBlog((prev) => ({
                id: findBlogForUpdate.id,
                title: findBlogForUpdate.title,
                topics: findBlogForUpdate.topics,
                content: findBlogForUpdate.content,
                show: true
            }))
        } catch (error) {
            console.log(error)
        }
    }


    const removeThisBlogView = async (e) => {
        try {
            const getUserForDelete = await axios.get(`http://localhost:3001/users/${store.userId}`);
            let userData = getUserForDelete.data;
            setUser(userData)
            const filteredBlogs = userData.blogs.filter(blog => blog.id !== e.id);
            setUser({
                ...userData,
                blogs: filteredBlogs
            })
            setDeleteModalVisible(true)
        } catch (error) {
            console.log(error)
        }

    }

    const removeBlog = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/users/${store.userId}`, user)
            console.log(response);
            dispatch(setAllBlogs(user.blogs));
            toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Deletion successful', life: 3000 });
            setDeleteModalVisible(false);
        } catch (error) {
            console.log(error)
        }
    }

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setDeleteModalVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={removeBlog} autoFocus />
        </div>
    );



    const updateFooterContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setShowEditableBlog((prev) => ({
                ...prev,
                show: false
            }))} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => updateBlog()} autoFocus />
        </div>
    );

    const updateInputHandler = (val, type) => {
        setShowEditableBlog((prev) => ({
            ...prev,
            [type]: val
        }))
    };

    const updateBlog = async () => {
        try {
            const updatedThatBlog = user.blogs.map((blog) => {
                if (blog.id === showEditableBlog.id) {
                    blog.id = showEditableBlog.id;
                    blog.title = showEditableBlog.title;
                    blog.topics = showEditableBlog.topics;
                    blog.content = showEditableBlog.content;
                }
                return blog
            })
            const updatedUserObject = {
                ...user,
                blogs: updatedThatBlog,
            };
            const response = await axios.put(`http://localhost:3001/users/${store.userId}`, updatedUserObject)
            if (response.status === 200) {
                dispatch(setAllBlogs(updatedThatBlog))
                setShowEditableBlog((prev) => ({
                    ...prev,
                    show: false
                }))
                setShowEditableBlog((prev) => ({
                    ...prev,
                    show:false
                }))
            }
        } catch (error) {
            console.log(error);
        }
    }




    return (
        <motion.div
            className="allcards flex justify-content-center"
            // style={store.isSideBarOpen ? {gridTemplateColumns:"repeat(2,1fr)"} : {gridTemplateColumns:"repeat(3,1fr)"}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <Dialog header="Content" visible={showBlogContent} position={"right"} style={{ width: '50vw' }} onHide={() => { if (!showBlogContent) return; setShowBlogContent(false); }} draggable={false} resizable={false}>
                <p className="m-0">
                    {blogContent}
                </p>
            </Dialog>
            <Toast ref={toast} />
            <Dialog header="Update Blog" visible={showEditableBlog.show} style={{ width: '50vw' }} onHide={() => { if (!showEditableBlog.show) return; setShowEditableBlog((prev) => ({ ...prev, show: false })) }} footer={updateFooterContent}>
                <div className="update-input-form">
                    <div>
                        <label htmlFor="id">Id:</label>
                        <InputNumber value={showEditableBlog.id} disabled />
                    </div>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <InputText value={showEditableBlog.title} onChange={(e) => updateInputHandler(e.target.value, "title")} />
                    </div>
                    <div>
                        <label htmlFor="topics">Topics:</label>
                        {showEditableBlog.topics.map((element, index) => {
                            return (<>
                                <Chip label={element} onClick={() => console.log(element)} />
                            </>
                            )
                        })}
                    </div>
                    <div>
                        <label htmlFor="topics">Content:</label>
                        {/* <InputText value={showEditableBlog.content} onChange={(e) => updateInputHandler(e.target.value, "content")} /> */}
                        <InputTextarea value={showEditableBlog.content} onChange={(e) => updateInputHandler(e.target.value, "content")} rows={5} cols={30} />
                    </div>
                </div>
            </Dialog>
            <Dialog header="Header" visible={deleteModalVisible} style={{ width: '50vw' }} onHide={() => { if (!deleteModalVisible) return; setDeleteModalVisible(false); }} footer={footerContent}>
                <p className="m-0">Are you sure you want to delete this blog?</p>
            </Dialog>
            <div className="card">
                <DataTable value={store.userBlogs} scrollable scrollHeight="400px" style={{ minWidth: '50rem' }}>
                    <Column field="id" header="ID"></Column>
                    <Column field="title" header="Name"></Column>
                    <Column
                        field="topics"
                        header="Topics"
                        body={topicsTemplate}>
                    </Column>
                    <Column field="content" header="Content" body={(e) => contentTemplate(e)}></Column>
                    <Column field="edit" header="Edit" body={(e) => editBlog(e)} ></Column>
                    <Column field="delete" header="Delete" body={(e) => deleteBlog(e)}></Column>
                </DataTable>
            </div>
        </motion.div>
    )
}

export default Blogs