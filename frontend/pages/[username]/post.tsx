import { Input, Spacer, Button, Toggle, Textarea, Radio } from "@geist-ui/react";
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import encodeImageToBlurhash from "../../helpers/blurhash";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileRename,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform
);

export default function CreatePost(): JSX.Element {

  const ref = React.useRef(null)
  const setChange = () => {
    ref && (ref.current.value = Math.random().toString(32))
  }

  const [files, setFiles] = useState([]);

  const [value, setValue] = useState()
  const handler = (e) => {
    setValue(e.target.value)
    console.log(e.target.value)
  }

  return (
    <>

      <div className="flex flex-col gap-8 justify-center items-center p-10 w-4/6 border-2 border-yellow-400">

        <div className="flex flex-row justify-center ">
          <p>Title</p>
          <Input initialValue="Hello" onChange={e => console.log(e.target.value)} ref={ref} />
        </div>

        {/* <Spacer h={.5} /> */}

        {/* Audio, Video, Text, Content type */}
        <Radio.Group value="1" useRow>
          <Radio value="1">
            Hype Text
            <Radio.Desc>Markdown supported!</Radio.Desc>
          </Radio>
          <Radio value="2">
            Hype Canvas
            <Radio.Desc>Supported file formats: JPEG, PNG</Radio.Desc>
          </Radio>
          <Radio value="3">
            Hype Video
            <Radio.Desc>Supported file formats: MPEG, MP4</Radio.Desc>
          </Radio>
        </Radio.Group>

        {/* description text */}
        <Textarea
          width="50%"
          height="96px"
          resize={'vertical'}
          value={value}
          onChange={handler}
          placeholder="Now is the optimal workflow for frontend teams. All-in-one: Static and JAMstack deployment, Serverless Functions, and Global CDN."
        />

        {/* <Previews /> */}
        <div className="w-2/4">
          <FilePond
            files={files}
            allowReorder={true}
            allowMultiple={false}
            allowProcess={true}
            onupdatefiles={setFiles}
            instantUpload={true}

            required={true}
            onpreparefile={(file, output) => {
              // berfore uploading file
            }}

            onprocessfile={async (err, file) => {
              console.log('hello')
            }}
            chunkUploads={true}
            acceptedFileTypes={['image/jpg']}

            server={{
              // @ts-expect-error pata nahi
              process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                // fieldName is the name of the input field
                // file is the actual file object to send

                // const formData = new FormData();
                // formData.append(fieldName, file, file.name);
                console.log(fieldName, metadata)

                const blurhashUrl = URL.createObjectURL(file);
                console.log({ blurhashUrl })

                const request = new XMLHttpRequest();
                request.open('PUT', "https://hypeblobs.blob.core.windows.net/museum/c8481980-297a-11ec-ba4b-75cf77b202b4?sv=2020-10-02&st=2021-10-10T03%3A33%3A06Z&se=2021-10-10T04%3A33%3A06Z&sr=b&sp=rw&sig=nnOxVDjkDLFLsmHCqHIA4%2FonScjxhi3MMTsvNDq2pl4%3D");

                request.setRequestHeader("x-ms-blob-type", "BlockBlob")
                request.setRequestHeader("x-ms-version", "2020-10-02")

                request.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:3001/")
                request.setRequestHeader("x-ms-blob-content-type", "image/jpeg")
                request.setRequestHeader("Content-Type", "image/jpeg")
                // request.setRequestHeader("x-ms-blob-content-length", "10000000000")
                // Should call the progress method to update the progress to 100% before calling load
                // Setting computable to false switches the loading indicator to infinite mode
                request.upload.onprogress = (e) => {
                  progress(e.lengthComputable, e.loaded, e.total);
                };

                // Should call the load method when done and pass the returned server file id
                // this server file id is then used later on when reverting or restoring a file
                // so your server knows which file to return without exposing that info to the client
                request.onload = function () {
                  if (request.status >= 200 && request.status < 300) {
                    // the load method accepts either a string (id) or an object
                    load(request.responseText);
                  } else {
                    // Can call the error method if something is wrong, should exit after
                    error('oh no');
                  }
                };

                request.send(file);

                // Should expose an abort method so the request can be cancelled
                return {
                  abort: () => {
                    // This function is entered if the user has tapped the cancel button
                    request.abort();

                    // Let FilePond know the request has been cancelled
                    abort();
                  },
                };
              },

              //   {
              //     url: "/",

              //     headers: {
              //       "x-ms-blob-type": "BlockBlob",
              //       "Authorization":"?sv=2020-10-02&st=2021-10-09T21%3A56%3A35Z&se=2021-10-09T22%3A56%3A35Z&sr=b&sp=w&sig=Vyjj7leae%2Bekm2NgCzOC28E4Ebtqm9ZA6Vf%2FfMaxY8w%3D",
              //       "Access-Control-Allow-Origin":"http://localhost:3001/",
              //       "Origin": "http://localhost:3001/",
              //     },
              //     method: 'PUT',
              //   }
              // }}
            }}

            // allowImageCrop={true}
            // allowImageTransform={true}
            allowPaste={true}

            // imageCropAspectRatio={'3:4'}

            fileRenameFunction={(file) => {
              return `c5d30630-294b-11ec-b63b-85f0038034e8${file.extension}`
            }}

            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>

        {/* locked */}
        <Toggle type='warning' initialChecked scale={4} onChange={e => console.log(e.target.checked)} />

        <Button auto type="secondary" scale={1 / 3} onClick={setChange}>set value</Button>
      </div>
    </>
  )
}
