import { useRef } from 'react';
import { BsPersonFill } from 'react-icons/bs';

export default function AvatarUpload({
  value,
  onChange,
  accepts = 'image/*, video/*',
}) {
  const ref = useRef();

  const uploadPhoto = async (e) => {
    if (!e.target.files.length) {
      return;
    }
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const filetype = encodeURIComponent(file.type);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/upload?file=${filename}&type=${filetype}`,
      { credentials: 'include' }
    );
    const { url, fields } = await res.json();

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
      onChange(fields.key);
      console.log(
        `Uploaded successfully! - visit https://cdn.trckd.ca/${fields.key}`
      );
    } else {
      console.error('Upload failed.');
    }
  };

  return (
    <section className="py-2 relative mr-3">
      <button onClick={() => ref.current.click()}>
        <input
          onChange={uploadPhoto}
          className="hidden"
          type="file"
          accept={accepts}
          ref={ref}
        />
        {!value ? (
          <button className="p-4 rounded-full border-2 bg-gray-50">
            <BsPersonFill className="w-7 h-7" />
          </button>
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
