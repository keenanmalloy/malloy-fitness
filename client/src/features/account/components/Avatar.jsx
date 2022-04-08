import React, { useEffect } from 'react';
import Upload from 'features/Upload';
import { useAccountFieldMutation } from 'features/account/api/useAccountFieldMutation';

export const Avatar = ({ onChange, value, field, prevValue }) => {
  const { mutate, isLoading, isError } = useAccountFieldMutation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        mutate({
          payload: {
            [field]: value,
          },
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  return (
    <div className="flex flex-row-reverse">
      <Upload
        onChange={(key) => {
          if (!key) {
            return onChange('');
          } else {
            onChange(`https://cdn.trckd.ca/${key}`);
          }
        }}
        hidePreview
      />
      {!value ? (
        <div />
      ) : (
        <img
          src={value}
          className="inline object-cover w-20 h-20 rounded-full p-1"
        />
      )}
    </div>
  );
};
