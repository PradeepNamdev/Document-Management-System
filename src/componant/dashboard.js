import React, { useEffect, useState, useRef, useMemo } from "react"
import Header from "./header";
import { Button, Card, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import service from "../service/service";
import './tree.css';
import DataTable from "react-data-table-component-with-filter";
import Videojs from './video.js';
import FilterComponent from './FilterComponent';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import swal from 'sweetalert';


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
            // paddingLeft: '0 8px',
            // marginLeft: '10px'
        },
    },
};

function Dashboard() {
    const [errorMsg, setErrorMsg] = useState();
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
        if (folder_name.value === "") {
            return setErrorMsg("* Please Enter Folder Name ")
        }
        let dirname = folder_name.value;
        if (getParentId.length == 0) {
            let register = { dirName: dirname, lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866" };
            service.createDirectory(register)
                .then(async response => {
                    if (response.status == 201) {
                        await swal("Created!", "Your Folder Created.", "success");
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
                .then(async response => {
                    if (response.status == 200) {
                        await swal("Created!", "Your Child Folder Created.", "success");
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



    /* Edit Dirctory Code Start Here*/
    const [getDirNameUpdateModal, setDirNameUpdateModal] = useState({
        show: false,
        dirName: '',
        dirParentId: ''
    });
    const FolderNameUpdateModalHide = () => {
        setDirNameUpdateModal({ show: false });
    }
    const directoryEdit = (Id, Name) => {
        setErrorMsg();
        setDirNameUpdateModal({ show: true, dirParentId: Id, dirName: Name });
    }
    const UpdateFolderName = (dirId) => {
        const fname = document.getElementById("folder_name");
        if (fname.value === "") {
            return setErrorMsg("* Please Enter Folder Name");
        }
        let dirname = fname.value;
        let data = { dirName: dirname, lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866", dirParentId: dirId };
        service.folderNameUpdate(data)
            .then(async res => {
                if (res.status == 200) {
                    await swal("Update!", "Folder Updated Successfull !!.", "success");
                    service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                        .then(res => {
                            setFolder(res.data);
                        })
                    setDirNameUpdateModal({ show: false });
                } else {
                    alert("some error");
                }

            })
    }

    /* Edit Dirctory Code End Here*/

    const [getParentId, setParentId] = useState([]);
    const [getFolderName, setFolderName] = useState();
    const [getContentDetails, setContentDetails] = useState([]);
    const dirClick = (dirId, dirName) => {
        //console.log(dirId, dirName)

        // setParentId(dirId);
        // setFolderName(dirName);


        // service.contentDetails(dirId, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
        //     .then(res => {
        //         setContentDetails(res.data);
        //     })

        // var toggler = document.getElementsByClassName("caret");
        // var i;
        // for (i = 0; i < toggler.length; i++) {
        //     toggler[i].addEventListener("click", function () {
        //         this.parentElement.querySelector(".nested").classList.toggle("active");
        //         this.classList.toggle("caret-down");

        //     });
        // }
        var togglers = document.querySelectorAll(".caret");
        togglers.forEach((toggler) => {
            toggler.onclick = function () {
                toggler.parentElement.querySelector(".nested").classList.toggle("active");
                toggler.classList.toggle("caret-down");
            };
        });
    }

    // var togglers = document.querySelectorAll(".caret");
    // togglers.forEach((toggler) => {
    //     toggler.onclick = function () {
    //         toggler.parentElement.querySelector(".nested").classList.toggle("active");
    //         toggler.classList.toggle("caret-down");
    //     };
    // });

    const abc1 = (dirId, dirName) => {
        //console.log(dirId, dirName);
        setParentId(dirId);
        setFolderName(dirName);
        service.contentDetails(dirId, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
            .then(res => {
                setContentDetails(res.data);
            })
    }

    const deleteDirectory = (id) => {
        swal({
            title: "Are you sure?",
            text: "You Want to Delete this Folder Structure!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }).then(isConfirmed => {
            if (isConfirmed) {
                let data = { lastModifiedBy: "19f4bfda-4ec5-4e74-8b38-bcc15399e866", dirParentId: id };
                service.deleteDirectory(data)
                    .then(async res => {
                        if (res.data === "deleted successfully") {
                            await swal("Deleted!", "Your Folder has been deleted.", "success");
                            service.getFolderStructure("19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                                .then(res => {
                                    setFolder(res.data);
                                })
                        }
                    })
            }
        });
    }

    const Tree = ({ data }) => (
        <ul class="tree">
            {data && data.map(item => (
                <li style={{ marginTop: "5px" }}>
                    <span class="caret" onClick={() => dirClick(item.Id, item.Name)}><span onClick={() => abc1(item.Id, item.Name)}>{item.Name}&nbsp;&nbsp;</span></span>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Delete</Tooltip>}>
                        <span className="d-inline-block">
                            <a class="link" href="#"><i class="fas fa-trash" onClick={() => deleteDirectory(item.Id)} style={{ fontSize: "16px" }}></i></a>&nbsp;&nbsp;
                        </span>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Edit</Tooltip>}>
                        <span className="d-inline-block">
                            <a class="link" href="#"><i class="fas fa-edit" onClick={() => directoryEdit(item.Id, item.Name)} style={{ fontSize: "16px" }}></i></a>
                        </span>
                    </OverlayTrigger>
                    {item.Child &&
                        <ul class="nested">
                            {<Tree data={item.Child} />}
                        </ul>
                    }
                </li>
            ))}
        </ul>
    );
    const alertMsg = () => {
        swal("Select", "Select Node Firstly !!.", "warning");
    }
    const [getUrl, setUrl] = useState();
    const [getContentType, setContentType] = useState();
    const contentView = (contentType, url) => {
        service.contentAccess(url)
            .then(res => {
                setUrl(res.data);
                setContentType(contentType);
                setUrlModal({ show: true });
            })
    }
    const [getShareUrlData, setShareUrlData] = useState();
    const [ShareUrlModal, setShareUrlModal] = useState({
        show: false
    });
    const shareUrlModalHide = () => {
        setShareUrlModal({ show: false });
    }
    const ShareUrl = (url) => {
        service.contentAccess(url)
            .then(res => {
                setShareUrlData("http://pranit-pc.hyderabad.cdac.in:8080/" + res.data);
                setShareUrlModal({ show: true });
                let copyText = document.querySelector(".copy-text");
                copyText.querySelector("button").addEventListener("click", function () {
                    let input = copyText.querySelector("input.text");
                    input.select();
                    document.execCommand("copy");
                    copyText.classList.add("active");
                    window.getSelection().removeAllRanges();
                    setTimeout(function () {
                        copyText.classList.remove("active");
                    }, 2500);
                });
            })
    }

    const contentDelete = (contentId, folder_id) => {
        swal({
            title: "Are you sure?",
            text: "You Want to Delete this Content!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }).then(isConfirmed => {
            if (isConfirmed) {
                service.contentDelete(contentId)
                    .then(async res => {
                        if (res.status == 200) {
                            await swal("Deleted!", "Your Content has been deleted.", "success");
                            service.contentDetails(folder_id, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                                .then(res => {
                                    setContentDetails(res.data);
                                })
                        }
                    })
            }
        });
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
            name: "Preview",
            sortable: true,
            cell: (row) => <a class="link" href="#" onClick={() => contentView(row.contentType, row.previewUrl)}>
                {row.contentType === "zip" ? <i class="fas fa-file-archive" style={{ fontSize: "25px", color: "#fdbf00" }}></i>
                    : row.contentType === "pdf" ? <i class="fas fa-file-pdf" style={{ fontSize: "25px", color: "#b30b00" }}></i>
                        : row.contentType === "jpg" || row.contentType === "png" || row.contentType === "jpeg" ? <i class="fas fa-file-image" style={{ fontSize: "25px", color: "#b2b1ff" }}></i>
                            : row.contentType === "html" ? <i class="fab fa-html5" style={{ fontSize: "25px", color: "#e54c21" }}></i>
                                : row.contentType === "ogg" || row.contentType === "webm" || row.contentType === "mp4" ? <i class="fas fa-file-video" style={{ fontSize: "25px", color: "#8cee02" }}></i>
                                    : row.contentType === "txt" ? <i class="fas fa-file-alt" style={{ fontSize: "25px", color: "#2766a0" }}></i>
                                        : row.contentType === "doc" || row.contentType === "docx" ? <i class="fas fa-file-word" style={{ fontSize: "25px", color: "#1e62b4" }}></i>
                                            : row.contentType === "scorm" ? <i class="far fa-file-archive" style={{ fontSize: "25px", color: "green" }}></i>
                                                : null}
            </a>
        },
        {
            name: "Share Url",
            sortable: true,
            cell: (row) => <>{row.contentType === "zip" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                <span className="d-inline-block">
                    <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                </span>
            </OverlayTrigger>
                : row.contentType === "pdf" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                    <span className="d-inline-block">
                        <CopyToClipboard text={getShareUrlData}>
                            <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                        </CopyToClipboard>
                    </span>
                </OverlayTrigger>
                    : row.contentType === "jpg" || row.contentType === "png" || row.contentType === "jpeg" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                        <span className="d-inline-block">
                            <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                        </span>
                    </OverlayTrigger>
                        : row.contentType === "html" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                            <span className="d-inline-block">
                                <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                            </span>
                        </OverlayTrigger>
                            : row.contentType === "ogg" || row.contentType === "webm" || row.contentType === "mp4" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                                <span className="d-inline-block">
                                    <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                                </span>
                            </OverlayTrigger>
                                : row.contentType === "txt" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                                    <span className="d-inline-block">
                                        <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                                    </span>
                                </OverlayTrigger>
                                    : row.contentType === "doc" || row.contentType === "docx" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                                        <span className="d-inline-block">
                                            <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                                        </span>
                                    </OverlayTrigger>
                                        : row.contentType === "scorm" ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Click to Copy!</Tooltip>}>
                                            <span className="d-inline-block">
                                                <a class="link" onClick={() => ShareUrl(row.previewUrl)} href="#"><i class="fas fa-link"></i></a>
                                            </span>
                                        </OverlayTrigger>
                                            : null}
            </>
        },

        {
            name: "Action",
            sortable: true,
            cell: (row) => <div>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Delete</Tooltip>}>
                    <span className="d-inline-block">
                        <a class="link" href="#"><i class="fas fa-trash" onClick={() => contentDelete(row.contentId, getParentId)} style={{ fontSize: "20px", color: "#006dff" }}></i></a>
                    </span>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Edit</Tooltip>}>
                    <span className="d-inline-block">
                        <a class="link" href="#"><i class="fas fa-edit" onClick={() => contentEdit(row.contentId, row.contentName, row.contentDuration)} style={{ fontSize: "20px", color: "#006dff", marginLeft: '20px' }}></i> </a>
                    </span>
                </OverlayTrigger>
            </div>
        }
    ];


    /* Table content Filter and Search */
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
        false
    );
    const filteredItems = getContentDetails.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={e => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    /* File Content Update Code Start */
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
        setErrorMsg();
        setFileContentDetails({ contentId: contentId, contentName: contentName, contentDuration: contentDuration })
        setFileContentUpdateModalState({ show: true });

    }
    const UpdateFileDatails = (contentId, folder_id) => {
        const duration = document.getElementById("duration");
        const file_name = document.getElementById("file_name");
        if (duration.value === "" || file_name === "") {
            return setErrorMsg("* Please Enter Content Details");
        }
        let fileName = file_name.value;
        let durationMin = duration.value;
        let data = { contentId: contentId, contentName: fileName, contentDuration: durationMin };
        service.fileCotentDetailsUpdate(data)
            .then(async res => {
                if (res.status == 200) {
                    await swal("Update!", "Details Update Successfull !!.", "success");
                    setFileContentUpdateModalState({ show: false });
                    service.contentDetails(folder_id, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                        .then(res => {
                            setContentDetails(res.data);
                        })
                }
            })
    }
    /* File Content Update Code End */

    const videoJsOptions = {
        autoplay: false,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        width: 1100,
        height: 800,
        controls: true,
        sources: [
            {
                src: `http://10.244.0.43:8080/${getUrl}`,
                type: 'video/mp4',
            },
        ]
    };



    /* File Upload Code */

    const [getabc, setabc] = useState(
        {
            selectedFiles: undefined,
            currentFile: undefined,
            file: '',
        }
    )
    const [checkBox, setCheckBox] = useState(false);
    const [show, setShow] = useState();
    const selectFile = (event) => {
        let fi = document.getElementById('file');
        var files = fi.files;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type == "application/x-zip-compressed") {
                setShow(true);
            } else {
                setShow(false);
            }
            // console.log("Filename: " + files[i].name);
            // console.log("Type: " + files[i].type);
            // console.log("Size: " + files[i].size + " bytes");
        }
        setabc({
            selectedFiles: event.target.files,
        });
    }
    // const [errorMsg, setErrorMsg] = useState();
    const upload = () => {
        const duration = document.getElementById("duration");
        const file_name = document.getElementById("file_name");
        if (file_name.value === "") {
            return setErrorMsg("* Please Enter File Name")
        }
        if (duration.value === "") {
            return setErrorMsg("* Please Enter File Duration")
        }

        let fileName = file_name.value;
        let durationMin = duration.value;
        let fi = document.getElementById('file');
        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {

                const fsize = fi.files.item(i).size;
                const file = Math.round((fsize / 102400));
                // The size of the file.
                if (file >= 102400) {
                    swal("Warning!", "File size exceeded Max Size 100 MB!!", "warning");
                }
            }
        }
        let currentFile = getabc.selectedFiles[0];
        setabc({
            currentFile: currentFile,
        });
        service.fileUpload(currentFile, "19f4bfda-4ec5-4e74-8b38-bcc15399e866", getParentId, durationMin, fileName, checkBox, (event) => {
        }).then(async res => {
            if (res.status === 200) {
                await swal("Message!", res.data, "info");
                setUploadModalState({ show: false });
                service.contentDetails(getParentId, "19f4bfda-4ec5-4e74-8b38-bcc15399e866")
                    .then(res => {
                        setContentDetails(res.data);
                    })
            }
        })
            .catch(err => {
                setabc({
                    currentFile: undefined,
                });
            });

        setabc({
            selectedFiles: undefined,
        });
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
                                data={filteredItems}
                                defaultSortField="Name"
                                defaultSortAsc={true}
                                striped
                                pagination
                                highlightOnHover
                                customStyles={customStyles}
                                subHeader
                                subHeaderComponent={subHeaderComponent}
                            />
                        </Card>
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
                        <span style={{ color: "red" }}>{errorMsg}</span>
                        {/* {getParentId} */}
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
                    <div>
                        <div style={{ marginLeft: 10, color: 'red' }}>
                            <span>Upload files (Max Size 100 MB)</span>
                        </div>
                        <div style={{ marginLeft: 10, color: 'red' }}>
                            <span>Required Files (pdf, jpg, mp4, doc, text, zip, scorm)</span>
                        </div>
                        <div class="mb-3 mt-3">
                            <label for="name">File Name : </label>
                            <input type="text" class="form-control" id="file_name" placeholder="Enter File Name" name="file_name" />
                            <span style={{ color: "red" }}>{errorMsg}</span>
                        </div>
                        <div class="mb-3 mt-3">
                            <label for="name">Duration in Minutes : </label>
                            <input type="number" class="form-control" min="0" max="60" id="duration" placeholder="Duration in Minutes" name="duration" />
                            <span style={{ color: "red" }}>{errorMsg}</span>
                        </div>
                        <div class="mb-3 mt-3">
                            <input type="file" class="form-control" onChange={selectFile} accept="*" id="file" />
                        </div>
                        {show == true ? <div class="mb-3 mt-3">
                            <label for="name">Scorm Zip &nbsp; </label>
                            <input type="checkbox" id="ScormCheckbox" onClick={() => setCheckBox(true)} data-toggle="toggle" data-onstyle="primary"></input>
                        </div> : null}

                        <button className="btn btn-success" disabled={!getabc.selectedFiles} onClick={() => upload()}>Upload</button>
                    </div>
                    {/* <FileUpload userId={props.userId} courseId={props.courseId} tenantId={props.tenantId} assignId={getAssignId} /> */}
                    {/* <FileUpload user_id={"19f4bfda-4ec5-4e74-8b38-bcc15399e866"} dir_name={getParentId} /> */}
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
                        {getContentType === "zip" ? <i class="fas fa-file-archive" style={{ fontSize: "25px", color: "#fdbf00" }}> Zip</i>
                            : getContentType === "pdf" ? <i class="fas fa-file-pdf" style={{ fontSize: "25px", color: "#b30b00" }}> PDF</i>
                                : getContentType === "jpg" || getContentType === "png" || getContentType === "jpeg" ? <i class="fas fa-file-image" style={{ fontSize: "25px", color: "#b2b1ff" }}> Image</i>
                                    : getContentType === "html" ? <i class="fab fa-html5" style={{ fontSize: "25px", color: "#e54c21" }}> Html</i>
                                        : getContentType === "ogg" || getContentType === "webm" || getContentType === "mp4" ? <i class="fas fa-file-video" style={{ fontSize: "25px", color: "#8cee02" }}> Video</i>
                                            : getContentType === "txt" ? <i class="fas fa-file-alt" style={{ fontSize: "25px", color: "#2766a0" }}> Text</i>
                                                : getContentType === "doc" || getContentType === "docx" ? <i class="fas fa-file-word" style={{ fontSize: "25px", color: "#1e62b4" }}> Doc</i>
                                                    : getContentType === "scorm" ? <i class="far fa-file-archive" style={{ fontSize: "25px", color: "green" }}> Scorm</i>
                                                        : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        getContentType === "jpg" || getContentType === "png" || getContentType === "jpeg" ? <img src={`http://10.244.0.43:8080/${getUrl}`} width="1100" height="800" />
                            : getContentType === "pdf" ? <iframe width="1100" height="800" src={`http://10.244.0.43:8080/${getUrl}`} type="application/pdf" ></iframe>
                                : getContentType === "mp4" ? <div> <Videojs {...videoJsOptions} /></div>
                                    : getContentType === "docx" ? <iframe width="100%" height="100%" src={`http://10.244.0.43:8080/${getUrl}`} ></iframe>
                                        : getContentType === "html" ? <iframe width="1100" height="800" src={`http://10.244.0.43:8080/${getUrl}`} ></iframe>
                                            : getContentType === "zip" ? <iframe width="1100" height="800" src={`http://10.244.0.43:8080/${getUrl}`} ></iframe>
                                                : getContentType === "scorm" ? <iframe width="1100" height="800" src={`http://10.244.0.43:8080/${getUrl}`} ></iframe>
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
                        <span style={{ color: "red" }}>{errorMsg}</span>
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="name">Duration : </label>
                        <input type="number" class="form-control" defaultValue={getFileContentDetails.contentDuration} min="0" max="60" id="duration" placeholder="Enter Duration" name="duration" />
                        <span style={{ color: "red" }}>{errorMsg}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => UpdateFileDatails(getFileContentDetails.contentId, getParentId)} className="btn btn-primary">Update</Button>
                    <Button onClick={() => FileContentUpdateModalHide(false)} className="btn btn-danger">Close</Button>
                </Modal.Footer>
            </Modal>
            {/* Content details update model code end here*/}

            {/* Dirctory Name details update model code start here*/}
            <Modal
                centered show={getDirNameUpdateModal.show} onHide={() => FolderNameUpdateModalHide()} >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Folder Name
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <FileUpload userId={props.userId} courseId={props.courseId} tenantId={props.tenantId} assignId={getAssignId} /> */}
                    <div class="mb-3 mt-3">
                        <label for="name">Folder Name : </label>
                        <input type="text" class="form-control" defaultValue={getDirNameUpdateModal.dirName} id="folder_name" placeholder="Enter Folder Name" name="folder_name" />
                        <span style={{ color: "red" }}>{errorMsg}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => UpdateFolderName(getDirNameUpdateModal.dirParentId)} className="btn btn-primary">Update</Button>
                    <Button onClick={() => FolderNameUpdateModalHide(false)} className="btn btn-danger">Close</Button>
                </Modal.Footer>
            </Modal>
            {/* Dirctory Name details update model code end here*/}


            {/* ShareUrl model code start here*/}
            <Modal centered show={ShareUrlModal.show} onHide={() => shareUrlModalHide()} >
                <Modal.Body style={{ padding: "0px" }}>
                    <div class="container" style={{ width: "75%" }}>
                        <div class="copy-text">
                            <input type="text" class="text" value={getShareUrlData} readonly />
                            <button>
                                <i class="fa fa-clone"></i>
                            </button>
                            <div style={{ marginLeft: "25px", marginTop: "-8px" }}><a href="#"><i class="fas fa-times" onClick={() => shareUrlModalHide()}></i></a></div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Share Url model code end here*/}
        </div>
    )
}


export default Dashboard;