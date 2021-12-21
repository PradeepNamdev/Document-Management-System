import React from 'react';
import { useState } from 'react';
import service from '../service/service';



function FileUpload(props) {
    // console.log("In assignment Upload" + props.userId + props.courseId + props.assignId);
    const [getabc, setabc] = useState(
        {
            selectedFiles: undefined,
            currentFile: undefined,
            file: '',
        }
    )
    const selectFile = (event) => {
        setabc({
            selectedFiles: event.target.files,
        });
    }

    const upload = () => {
        const duration = document.getElementById("duration");
        const file_name = document.getElementById("file_name");
        let fileName = file_name.value;
        let durationMin = duration.value;
        let fi = document.getElementById('file');
        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {

                const fsize = fi.files.item(i).size;
                const file = Math.round((fsize / 102400));
                // The size of the file.
                if (file >= 102400) {
                    alert("File size exceeded Max Size 100 MB!!");
                }
            }
        }
        let currentFile = getabc.selectedFiles[0];
        setabc({
            currentFile: currentFile,
        });
        service.fileUpload(currentFile, props.user_id, props.dir_name, durationMin, fileName, (event) => {
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                alert("File Uploaded Succesfully");
                window.location.reload();
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
            <div class="mb-3 mt-3">
                <label for="name">File Name : </label>
                <input type="text" class="form-control" id="file_name" placeholder="Enter File Name" name="file_name" />
            </div>
            <div class="mb-3 mt-3">
                <label for="name">Duration : </label>
                <input type="number" class="form-control" min="0" max="60" id="duration" placeholder="Enter Duration" name="duration" />
            </div>
            <div class="mb-3 mt-3">
                <input type="file" class="form-control" onChange={selectFile} accept="*" id="file" />
            </div>
            <button className="btn btn-success" disabled={!getabc.selectedFiles} onClick={() => upload()}>Upload</button>
        </div>
    );
}

export default FileUpload;