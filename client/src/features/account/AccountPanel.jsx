import React from 'react';
import { Input } from 'features/form/Input';
import { Avatar } from './Avatar';
import { AccountField } from './AccountField';
import { Logout } from 'features/auth/Logout';

export const AccountPanel = ({ account }) => {
  const [givenName, setGivenName] = React.useState(account.given_name);
  const [familyName, setFamilyName] = React.useState(account.family_name);
  const [name, setName] = React.useState(account.name);
  const [description, setDescription] = React.useState(account.description);
  const [phone, setPhone] = React.useState(account.phone);
  const [avatar, setAvatar] = React.useState(account.avatar_url);

  return (
    <div>
      <div>
        <AccountField
          label="First name"
          onChange={(e) => setGivenName(e.target.value)}
          value={givenName}
          field="given_name"
          prevValue={account.given_name}
        />

        <AccountField
          label="Last name"
          onChange={(e) => setFamilyName(e.target.value)}
          value={familyName}
          field="family_name"
          prevValue={account.family_name}
        />
      </div>
      <div>
        <AccountField
          label="Username"
          onChange={(e) => setName(e.target.value)}
          value={name}
          field="name"
          prevValue={account.name}
        />
      </div>
      <div>
        <label>Photo</label>
        <Avatar
          onChange={(url) => setAvatar(url)}
          value={avatar}
          field="avatar_url"
          prevValue={account.avatar_url}
        />
      </div>
      <div>
        <AccountField
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description ?? ''}
          field="description"
          isTextArea
          prevValue={account.description}
        />
      </div>

      <div>
        <Input
          label={'Email'}
          onChange={() => console.log('changed')}
          value={account.email}
          isDisabled
          prevValue={account.email}
        />
      </div>
      <div>
        <AccountField
          label="Phone number"
          onChange={(e) => setPhone(e.target.value)}
          value={phone ?? ''}
          field="phone"
          prevValue={account.phone}
        />
      </div>
      <small className="text-xs text-gray-500">
        Account created on{' '}
        {new Intl.DateTimeFormat('en-CA', {
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(new Date(account.created_at))}
        .
      </small>
      <Logout />
    </div>
  );
};
