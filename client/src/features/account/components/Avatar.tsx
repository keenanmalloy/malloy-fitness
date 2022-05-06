import React, { useEffect } from 'react';
import { useAccountFieldMutation } from 'features/account/api/useAccountFieldMutation';
import AvatarUpload from './AvatarUpload';

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
    <AvatarUpload
      value={value}
      onChange={(key) => {
        if (!key) {
          return onChange('');
        } else {
          onChange(`https://cdn.trckd.ca/${key}`);
        }
      }}
      hidePreview
    />
  );
};
