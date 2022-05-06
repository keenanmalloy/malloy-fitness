import { useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Button } from './common/Button';
import Modal from './common/Modal';

export default function Upload({
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

  const removeFileAndUnlink = async (e) => {
    e.preventDefault();
    setCleared(true);
    setKey('');
    onChange(null);
    setIsSuccess(null);
    reset();
    setIsOpen(false);
  };

  return (
    <section className="py-2 relative">
      <div className="flex flex-col">
        <label className="">{title}</label>
        <small className="text-xs text-gray-500">(max 5GB).</small>
      </div>

      <input
        onChange={uploadPhoto}
        type="file"
        accept={accepts}
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
        onClick={() => setIsOpen(true)}
        className="absolute top-0 right-0 mt-1 mr-1 hover:text-gray-600"
      >
        <IoMdClose />
      </button>
      <Modal
        title="Are you sure?"
        description="This action will remove the file."
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <div className="pt-5 flex justify-between">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={removeFileAndUnlink}>Confirm</Button>
        </div>
      </Modal>

      {!hidePreview && (
        <>
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
        </>
      )}
    </section>
  );
}
