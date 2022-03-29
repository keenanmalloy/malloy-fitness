import { useState } from 'react';

export default function Upload() {
  const [success, setIsSuccess] = useState(null);
  const [filetype, setFiletype] = useState(null);
  const [key, setKey] = useState('');

  const uploadPhoto = async (e) => {
    if (!e.target.files.length) {
      return;
    }
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const filetype = encodeURIComponent(file.type);

    setFiletype(filetype);

    const res = await fetch(
      `http://localhost:4000/storage/upload?file=${filename}&type=${filetype}`,
      { credentials: 'include' }
    );
    const { url, fields } = await res.json();

    setKey(fields.key);

    const formData = new FormData();
    formData.append('Content-Type', file.type);
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (upload.ok) {
      setIsSuccess(true);
      console.log(
        `Uploaded successfully! - visit https://cdn.trckd.ca/${fields.key}`
      );
    } else {
      console.error('Upload failed.');
    }
  };

  return (
    <>
      <p>Upload image OR video (max 5GB).</p>
      <input onChange={uploadPhoto} type="file" accept="image/*, video/*" />

      {!!success && (
        <div>
          {filetype && filetype.includes('image') ? (
            <img src={`https://cdn.trckd.ca/${key}`} />
          ) : (
            <video autoPlay src={`https://cdn.trckd.ca/${key}`} />
          )}
        </div>
      )}
    </>
  );
}
