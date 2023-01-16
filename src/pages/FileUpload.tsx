import FileInput from "../components/FileInput";
import FileManager from "../services/FileManager";
import { toast } from 'react-toastify';

const FileUpload = () => {
    
  const handleFileSelected = (file: File | undefined) => {
    if (!file) {
      console.log("no file selected");
      return
    }
    const formData = new FormData();
    formData.append("key", '/')
    formData.append("file", file)

    FileManager.uploadFile(formData).then(res => {
      if (!res) throw new Error("no resultat")
      toast.success("Upload with success")
    }).catch(error => {
      console.log(error)
    })
  };

  return (
      <div >
        <h1>Upload your file: </h1>
        <FileInput onFileSelected={handleFileSelected} />
      </div>
  );
}

export default FileUpload;