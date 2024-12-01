import React from "react";
import { useFormikContext, useField } from "formik";
import { CKEditor } from "ckeditor4-react";

export const TanetCKEditor = ({
  data='',
  ...props
}) => {
  const { name, label, view, required, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      {view ?
        <p className="content-tienich pt-3" dangerouslySetInnerHTML={{ __html: field.value }}>
        </p> :
        <CKEditor
          //{...restProps}
          initData={data}
          onChange={(evt) =>
            setFieldValue(name, evt.editor.getData())
          }
          config={{
            // Cấu hình tùy chọn cho CKEditor, ví dụ: thêm plugin hình ảnh, video,...
            extraPlugins: "image2,uploadimage",
            // Nếu muốn thêm các plugin khác, bạn có thể thêm vào đây
            //filebrowserImageBrowseUrl: `aaaaaaaaaaaaaa` //& CKEditor= editor2 & CKEditorFuncNum=2
          }}
        />

      }
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};