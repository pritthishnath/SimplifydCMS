import React from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

const Editor = ({ content, onEditorChange, onChange }) => {
  return (
    <TinyMCEEditor
      value={content}
      init={{
        height: 440,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media code table paste imagetools wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | blockquote link image",
        // table_toolbar:
        //   "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        // table_grid: false,
        toolbar_mode: "sliding",
        images_upload_handler: function (blobInfo, success, failure, progress) {
          var xhr, formData;

          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open(
            "POST",
            `/api/tinymce-upload-image?key=${localStorage.getItem("jwt_token")}`
          );

          xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
          };

          xhr.onload = function () {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure("HTTP Error: " + xhr.status);
              return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.location != "string") {
              failure("Invalid JSON: " + xhr.responseText);
              return;
            }

            success(
              `${json.location}?key=${localStorage.getItem("jwt_token")}`
            );
          };

          xhr.onerror = function () {
            failure(
              "Image upload failed due to a XHR Transport error. Code: " +
                xhr.status
            );
          };

          formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },

        placeholder: "Write your story...",
      }}
      tinymceScriptSrc='/api/tinymce/tinymce.min.js'
      onEditorChange={onEditorChange}
      onChange={onChange}
    />
  );
};

export default Editor;
