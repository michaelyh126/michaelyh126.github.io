import{a0 as e,aX as a,r as s,E as i,W as l,a6 as r}from"./index-mqsoq1Bf.js";import{f as t}from"./format-number-DzFfVLUK.js";import{U as c}from"./index-CPATB6O-.js";const n=e.div`
  .ant-upload {
    border: none !important;
  }
  .ant-upload-list {
    display: ${e=>e.$thumbnail?"flex":"block"};
    flex-wrap: wrap;
  }
`,o=e.div`
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  .ant-upload,
  .ant-upload-select {
    border: none !important;
  }
`,d=e.div`
  .ant-upload {
    border: none !important;
  }
  .ant-upload-list {
    display: none;
  }
`,p=["pdf"],u=["txt"],f=["psd"],b=["doc","docx"],m=["xls","xlsx"],x=["zip","rar","iso"],g=["ai","esp"],k=["ppt","pptx"],_=["wav","aif","mp3","aac"],j=["jpg","jpeg","gif","bmp","png","svg"],v=["m4v","avi","mpg","mp4","webm"];function h(e){let a;switch(!0){case p.includes(y(e)):a="pdf";break;case u.includes(y(e)):a="txt";break;case f.includes(y(e)):a="psd";break;case b.includes(y(e)):a="word";break;case m.includes(y(e)):a="excel";break;case x.includes(y(e)):a="zip";break;case g.includes(y(e)):a="ai";break;case k.includes(y(e)):a="ppt";break;case _.includes(y(e)):a="audio";break;case j.includes(y(e)):a="img";break;case v.includes(y(e)):a="video";break;default:a=y(e)}return a}function w(e){let a;switch(h(e)){case"txt":a="ic_file_txt";break;case"zip":a="ic_file_zip";break;case"audio":a="ic_file_audio";break;case"video":a="ic_file_video";break;case"word":a="ic_file_word";break;case"excel":a="ic_file_excel";break;case"ppt":a="ic_file_ppt";break;case"pdf":a="ic_file_pdf";break;case"psd":a="ic_file_psd";break;case"ai":a="ic_file_ai";break;case"img":a="ic_file_img";break;case"folder":a="ic_folder";break;default:a="ic_file"}return a}function y(e=""){return e&&e.split(".").pop()||"folder"}function z(e){const s="image/jpeg"===e.type||"image/png"===e.type;s||a.error("You can only upload JPG/PNG file!");const i=e.size/1024/1024<2;return i||a.error("Image must smaller than 2MB!"),s&&i}function U(e){const a=new Blob([e]);return URL.createObjectURL(a)}function N({helperText:e,defaultAvatar:a="",...n}){const[d,p]=s.useState(a),[u,f]=s.useState(!1),b=e=>{f(e)},m=i.jsx("img",{src:d,alt:"",className:"absolute rounded-full"}),x=i.jsxs("div",{style:{backgroundColor:!d||u?"rgba(22, 28, 36, 0.64)":"transparent",color:"#fff"},className:"absolute z-10 flex h-full w-full flex-col items-center justify-center",children:[i.jsx(r,{icon:"solar:camera-add-bold",size:32}),i.jsx("div",{className:"mt-1 text-xs",children:"Upload Photo"})]}),g=i.jsxs("div",{className:"relative flex h-full w-full items-center justify-center overflow-hidden rounded-full",onMouseEnter:()=>b(!0),onMouseLeave:()=>b(!1),children:[d?m:null,!d||u?x:null]}),k=i.jsxs(l.Text,{type:"secondary",style:{fontSize:12},children:["Allowed *.jpeg, *.jpg, *.png, *.gif",i.jsx("br",{})," max size of ",t(3145728)]}),_=i.jsx("div",{className:"text-center",children:e||k});return i.jsxs(o,{children:[i.jsx(c,{name:"avatar",showUploadList:!1,listType:"picture-circle",className:"avatar-uploader !flex items-center justify-center",...n,beforeUpload:z,onChange:e=>{"uploading"!==e.file.status&&["done","error"].includes(e.file.status)&&p(U(e.file.originFileObj))},children:g}),_]})}export{n as S,N as U,h as a,U as b,d as c,w as g};
