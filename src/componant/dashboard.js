import React, { useEffect, useState, useMemo } from "react"
import Header from "./header";
import { Button, Card, Modal } from 'react-bootstrap';
import service from "../service/service";
import './tree.css';
import FileUpload from "./FileUpload";
import DataTable from "react-data-table-component-with-filter";
import { PDFReader } from 'reactjs-pdf-reader';
import Footer from "./footer";
import Videojs from './video.js';
import FileViewer from 'react-file-viewer';

const customStyles = {
    title: {
        style: {
            fontColor: 'red',
            fontWeight: '900',
        }
    },
    headCells: {
        style: {
            fontSize: '17px',
            fontWeight: '500',
            textTransform: 'uppercase',
            paddingLeft: '0 8px',
            marginLeft: '10px',
        },
    },
    cells: {
        style: {
            fontSize: '15px',
            paddingLeft: '0 8px',
            marginLeft: '10px'
        },
    },
};


function Dashboard() {

    const videoJsOptions = {
        autoplay: false,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        width: 720,
        height: 300,
        controls: true,
        sources: [
            {
                src: '//vjs.zencdn.net/v/oceans.mp4',
                type: 'video/mp4',
            },
        ],
    };

    const [getUploadModalState, setUploadModalState] = useState({
        show: false
    });
    const [getModalState, setModalState] = useState({
        show: false
    });

    const handleModal2 = () => {
        setModalState({ show: false })
    }

    const handleModal = () => {
        setModalState({ show: true })
    }

    const FileUploadModalShow = () => {
        setUploadModalState({ show: true })
    }

    const FileUploadModalHide = () => {
        setUploadModalState({ show: false })
    }

    const UrlModalHide = () => {
        setUrlModal({ show: false })
    }


    const [getUrlModal, setUrlModal] = useState({
        show: false
    })


    function changeBackgroundOver(e) {
        e.target.style.background = 'linear-gradient(90deg, #009444 0%, #11B67A 100%)';
    }

    function changeBackgroundOut(e) {
        e.target.style.background = 'linear-gradient(90deg, #11B67A 0%, #009444 100%)';
    }

    function save(getParentId) {
        const folder_name = document.getElementById("folderName");
        let dirname = folder_name.value;
        if (getParentId.length == 0) {
            let register = { dirName: dirname, lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866" };
            service.createDirectory(register)
                .then(response => {
                    if (response.status == 201) {
                        alert("Directory Created");
                        service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                            .then(res => {
                                setFolder(res.data);
                            })
                        setModalState(false);
                    } else {
                        alert("some error");
                    }

                })
        } else {
            let register = { dirName: dirname, lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866", dirParentId: getParentId };
            service.createChildDirectory(register)
                .then(response => {
                    if (response.status == 200) {
                        alert("Child Directory Created");
                        service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                            .then(res => {
                                setFolder(res.data);
                            })
                        setModalState(false);
                    } else {
                        alert("some error");
                    }
                })
        }
    }

    const [getFolder, setFolder] = useState([]);
    useEffect(() => {
        service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
            .then(res => {
                setFolder(res.data);
            })
    }, [])


    const [getParentId, setParentId] = useState([]);
    const [getFolderName, setFolderName] = useState();
    const [getContentDetails, setContentDetails] = useState([]);
    const dirClick = (dirId, dirName) => {
        console.log(dirId, dirName)
        setParentId(dirId);
        setFolderName(dirName);
        service.contentDetails(dirId, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
            .then(res => {
                setContentDetails(res.data);
            })

        // var toggler = document.getElementsByClassName("caret");
        // var i;
        // for (i = 0; i < toggler.length; i++) {
        //     toggler[i].addEventListener("click", function () {
        //         this.parentElement.querySelector(".nested").classList.toggle("active");
        //         this.classList.toggle("caret-down");
        //     });
        // }
    }

    // var togglers = document.querySelectorAll(".caret");
    // togglers.forEach((toggler) => {
    //     toggler.onclick = function () {
    //         toggler.parentElement.querySelector(".nested").classList.toggle("active");
    //         toggler.classList.toggle("caret-down");
    //     };
    // });
    const deleteDirectory = (id) => {
        let data = { lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866", dirParentId: id };
        service.deleteDirectory(data)
            .then(res => {
                if (res.data === "deleted successfully") {
                    alert("Folder Deleted Successfully");
                    service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                        .then(res => {
                            setFolder(res.data);
                        })
                }
            })
    }

    const Tree = ({ data }) => (
        <ul class="tree">
            {data && data.map(item => (
                <li style={{ marginTop: "5px" }}>
                    <span class="caret" onClick={() => dirClick(item.Id, item.Name)}>{item.Name}
                        <a class="link" href="#"><i class="las la-trash" onClick={() => deleteDirectory(item.Id)} style={{ fontSize: "20px" }}></i></a>
                        <a class="link" href="#"><i class="las la-edit" style={{ fontSize: "20px" }}></i></a>
                    </span>
                    {item.Child &&
                        <ul>
                            <Tree data={item.Child} />
                        </ul>
                    }
                </li>
            ))}
        </ul>
    );

    const alertMsg = () => {
        alert("Select Node First");
    }
    const [getUrl, setUrl] = useState();
    const [getContentType, setContentType] = useState();
    const contentView = (contentType, url) => {
        setUrl(url);
        setContentType(contentType);
        setUrlModal({ show: true });
    }

    const contentDelete = (contentId) => {
        service.contentDelete(contentId)
            .then(res => {
                if (res.status == 200) {
                    alert("Content Deleted Succesfully !!");
                    window.location.reload();
                }
            })
    }

    const columns = [
        {
            name: "Name",
            selector: "contentName",
            sortable: true,
        },
        {
            name: "Type",
            selector: "contentType",
            sortable: true
        },
        {
            name: "Duration",
            selector: "contentDuration",
            sortable: true,
        },
        {
            name: "View",
            sortable: true,
            cell: (row) => <a class="link" href="#" onClick={() => contentView(row.contentType, row.previewUrl)}>
                {row.contentType === "zip" ? <i class="fas fa-file-archive" style={{ fontSize: "25px", color: "#fdbf00" }}></i>
                    : row.contentType === "pdf" ? <i class="fas fa-file-pdf" style={{ fontSize: "25px", color: "#b30b00" }}></i>
                        : row.contentType === "jpg" || row.contentType === "png" || row.contentType === "jpeg" ? <i class="fas fa-file-image" style={{ fontSize: "25px", color: "#b2b1ff" }}></i>
                            : row.contentType === "html" ? <i class="fab fa-html5" style={{ fontSize: "25px", color: "#e54c21" }}></i>
                                : row.contentType === "ogg" || row.contentType === "webm" || row.contentType === "mp4" ? <i class="fas fa-file-video" style={{ fontSize: "25px", color: "#8cee02" }}></i>
                                    : row.contentType === "txt" ? <i class="fas fa-file-alt" style={{ fontSize: "25px", color: "#2766a0" }}></i>
                                        : row.contentType === "doc" || row.contentType === "docx" ? <i class="fas fa-file-word" style={{ fontSize: "25px", color: "#1e62b4" }}></i>
                                            : null}
            </a>
        },
        {
            name: "Action",
            sortable: true,
            cell: (row) => <div><a class="link" href="#"><i class="fas fa-trash" onClick={() => contentDelete(row.contentId)} style={{ fontSize: "20px", color: "#006dff" }}></i></a>
                <a class="link" href="#"><i class="fas fa-edit" onClick={() => contentEdit(row.contentId, row.contentName, row.contentDuration)} style={{ fontSize: "20px", color: "#006dff", marginLeft: '20px' }}></i>
                </a></div>
        }
    ];

    //File Content Update Code 
    const [getFileContentUpdateModalState, setFileContentUpdateModalState] = useState({
        show: false
    });
    const FileContentUpdateModalHide = () => {
        setFileContentUpdateModalState({ show: false })
    }
    const [getFileContentDetails, setFileContentDetails] = useState({
        contentId: '',
        contentName: '',
        contentDuration: ''
    })
    const contentEdit = (contentId, contentName, contentDuration) => {
        setFileContentDetails({ contentId: contentId, contentName: contentName, contentDuration: contentDuration })
        setFileContentUpdateModalState({ show: true });

    }
    const UpdateFileDatails = (contentId) => {
        const duration = document.getElementById("duration");
        const file_name = document.getElementById("file_name");
        let fileName = file_name.value;
        let durationMin = duration.value;
        let data = { contentId: contentId, contentName: fileName, contentDuration: durationMin };
        service.fileCotentDetailsUpdate(data)
            .then(res => {
                if (res.status == 200) {
                    alert("Details Update Successfully !!");
                    setFileContentUpdateModalState({ show: false });
                }
            })
    }

    return (
        <div>
            <Header />
            <div class="container-fluid">
                <div className="d-flex flex-row mb-3">

                    <div class="p-2 col-2 bd-highlight bg-light" >
                        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                            <svg class="bi me-2" width="40" height="32"></svg>
                            <span class="fs-4">Dashboard</span>
                        </a>
                        <hr />

                        <Tree class="tree" data={getFolder} />


                        <hr />
                    </div>
                    <div class="col-10 bd-highlight">
                        <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{ borderBottom: "1px inset" }}>
                            <div class="container-fluid">
                                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <div class="navbar-nav">
                                        <a class="nav-link" href="#" onClick={() => handleModal()}><i className="fas fa-folder-plus" style={{ fontSize: "25px", marginRight: "5px" }}></i>Create</a>&nbsp;&nbsp;
                                        {getParentId.length == 0 ?
                                            <a class="nav-link" href="#" onClick={() => alertMsg()} ><i className="fa fa-file-upload" style={{ fontSize: "25px", marginRight: "5px" }}></i>Upload</a>
                                            : <a class="nav-link" href="#" onClick={() => FileUploadModalShow()}><i className="fa fa-file-upload" style={{ fontSize: "25px", marginRight: "5px" }}></i>Upload</a>
                                        }
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{ borderBottom: "1px inset" }}>
                            <div class="container-fluid">
                                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <div class="navbar-nav">
                                        <a class="nav-link">MyFiles   &nbsp;&nbsp;
                                            <i className="fa fa-angle-right" ></i>
                                        </a>
                                        {getFolderName == null ? null :
                                            <a class="nav-link" href="#" >
                                                <i className="fa fa-folder-open" ></i> &nbsp;&nbsp;{getFolderName}
                                            </a>
                                        }
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <Card>
                            <DataTable
                                columns={columns}
                                data={getContentDetails}
                                defaultSortField="id"
                                defaultSortAsc={false}
                                pagination
                                highlightOnHover
                                customStyles={customStyles}
                                filter={true}
                            />
                        </Card>
                        <div>
                            <Videojs {...videoJsOptions} />
                        </div>
                    </div>


                </div>

            </div>

            {/* Folder Creation model code start here*/}
            <Modal
                centered show={getModalState.show} onHide={() => handleModal2()} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{ alignContent: "center" }}>
                        New Folder
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span style={{ fontSize: "20px" }}>New Folder Details</span><br />
                    Required Fields *
                    <div class="mb-3 mt-3">
                        <label for="name">Name : *</label>
                        <input type="text" class="form-control" id="folderName" placeholder="Enter Folder Name" name="folder" />
                        {getParentId}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: "center" }}>
                    <Button variant="primary" style={{ background: 'linear-gradient(90deg, #11B67A 0%, #009444 100%)' }}
                        onMouseOut={changeBackgroundOut} onMouseOver={changeBackgroundOver} id="register" onClick={() => save(getParentId)}>
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => handleModal2()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Folder Creation model code end here*/}

            {/* File upload model code start here*/}
            <Modal
                centered show={getUploadModalState.show} onHide={() => FileUploadModalHide()} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload Documents & Files
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <FileUpload userId={props.userId} courseId={props.courseId} tenantId={props.tenantId} assignId={getAssignId} /> */}
                    <FileUpload user_id={"19f4bfda-4ec5-4e74-8b38-bcc15399e866"} dir_name={getParentId} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setUploadModalState(false)} className="btn btn-danger">Close</Button>
                </Modal.Footer>
            </Modal>
            {/* File upload model code end here*/}

            {/* ContentView model code start here*/}
            <Modal
                size="xl" centered show={getUrlModal.show} onHide={() => UrlModalHide()} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Content
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        getContentType === "jpg" || getContentType === "png" || getContentType === "jpeg" ? <img src={getUrl} width="100%" height="100%" />
                            : getContentType === "pdf" ? <PDFReader showAllPage={true} url={getUrl} />
                                : getContentType === "mp4" ? <FileViewer filePath={getUrl} fileType="mp4" width="100%" height="100%" autoplay="muted" />
                                    : getContentType === "docx" ? <FileViewer
                                        fileType="docx"
                                        filePath={getUrl}

                                    />
                                        : <p>No Content Available</p>
                    }
                </Modal.Body>
            </Modal>
            {/* ContentView model code end here*/}

            {/* Content details update model code start here*/}
            <Modal
                centered show={getFileContentUpdateModalState.show} onHide={() => FileContentUpdateModalHide()} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update File Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <FileUpload userId={props.userId} courseId={props.courseId} tenantId={props.tenantId} assignId={getAssignId} /> */}
                    <div class="mb-3 mt-3">
                        <label for="name">File Name : </label>
                        <input type="text" class="form-control" defaultValue={getFileContentDetails.contentName} id="file_name" placeholder="Enter File Name" name="file_name" />
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="name">Duration : </label>
                        <input type="number" class="form-control" defaultValue={getFileContentDetails.contentDuration} min="0" max="60" id="duration" placeholder="Enter Duration" name="duration" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => UpdateFileDatails(getFileContentDetails.contentId)} className="btn btn-primary">Update</Button>
                    <Button onClick={() => FileContentUpdateModalHide(false)} className="btn btn-danger">Close</Button>
                </Modal.Footer>
            </Modal>
            {/* Content details update model code end here*/}
        </div>
    )
}


export default Dashboard;