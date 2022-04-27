import { useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';

export default function AvatarUpload({
  value,
  onChange,
  defaultSrc,
  hidePreview,
  title = 'Upload image or video',
  accepts = 'image/*, video/*',
}) {
  const [success, setIsSuccess] = useState(null);
  const [filetype, setFiletype] = useState(null);
  const [cleared, setCleared] = useState(null);
  const [key, setKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/upload?file=${filename}&type=${filetype}`,
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
      <button onClick={() => ref.current.click()}>
        <input
          onChange={uploadPhoto}
          className="hidden"
          type="file"
          accept={accepts}
          ref={ref}
        />
        {!value ? (
          <div />
        ) : (
          <img
            src={value}
            className="inline object-cover w-20 h-20 rounded-full p-1"
          />
        )}
      </button>
    </section>
  );
}
