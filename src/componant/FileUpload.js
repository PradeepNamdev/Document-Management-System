import React from 'react';
import { useState } from 'react';
import service from '../service/service';
import swal from 'sweetalert';
import Dashboard from './dashboard';



function FileUpload(props) {
    
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
    const [errorMsg, setErrorMsg] = useState();
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
        service.fileUpload(currentFile, props.user_id, props.dir_name, durationMin, fileName, checkBox, (event) => {
        }).then(async res => {
            if (res.status === 200) {
                await swal("Message!", res.data, "info");
                <Dashboard user_id={props.user_id} dir_name={props.dir_name} />
            }
        })
            .catch(err => {
                // if(err.message == 'Request failed with status code 500')
                // {
                //     swal("File size exceeded !!","","warning");
                // }
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
    );
}

export default FileUpload;