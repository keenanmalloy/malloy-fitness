import { useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

export default function Upload({ onChange, defaultSrc }) {
  const [success, setIsSuccess] = useState(null);
  const [filetype, setFiletype] = useState(null);
  const [cleared, setCleared] = useState(null);
  const [key, setKey] = useState('');

  const ref = useRef();

  const reset = () => {
    ref.current.value = '';
  };

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
      onChange(fields.key);
      console.log(
        `Uploaded successfully! - visit https://cdn.trckd.ca/${fields.key}`
      );
    } else {
      console.error('Upload failed.');
    }
  };

  return (
    <section className="py-2 relative">
      <div className="flex flex-col">
        <label className="">Upload image or video</label>
        <small className="text-xs text-gray-500">(max 5GB).</small>
      </div>

      <input
        onChange={uploadPhoto}
        type="file"
        accept="image/*, video/*"
        ref={ref}
        className="
        block
        w-full
        px-2
        py-1.5
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          setCleared(true);
          setKey('');
          onChange(null);
          setIsSuccess(null);
          reset();
        }}
        className="absolute top-0 right-0 mt-1 mr-1 hover:text-gray-600"
      >
        <IoMdClose />
      </button>

      {cleared ? null : !!success ? (
        <div>
          {filetype && filetype.includes('image') ? (
            <img src={`https://cdn.trckd.ca/${key}`} />
          ) : (
            <video autoPlay src={`https://cdn.trckd.ca/${key}`} />
          )}
        </div>
      ) : !!defaultSrc ? (
        <div>
          {defaultSrc.includes('/images/') ? (
            <img src={defaultSrc} />
          ) : (
            <video autoPlay src={defaultSrc} />
          )}
        </div>
      ) : null}
    </section>
  );
}
