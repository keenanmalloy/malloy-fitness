import React from 'react';
import { Input } from 'features/form/Input';
import { Avatar } from 'features/account/components/Avatar';
import { AccountField } from 'features/account/components/AccountField';
import { Logout } from 'features/account/components/Logout';

export const AccountPanel = ({ account }) => {
  const [givenName, setGivenName] = React.useState(account.given_name);
  const [familyName, setFamilyName] = React.useState(account.family_name);
  const [name, setName] = React.useState(account.name);
  const [description, setDescription] = React.useState(account.description);
  const [phone, setPhone] = React.useState(account.phone);
  const [avatar, setAvatar] = React.useState(account.avatar_url);
  const [weight, setWeight] = React.useState(account.weight);
  const [height, setHeight] = React.useState(account.height);
  const [dob, setDob] = React.useState(account.dob);
  const [gender, setGender] = React.useState(account.gender);
  const [city, setCity] = React.useState(account.city);
  const [country, setCountry] = React.useState(account.country);

  return (
    <section className="px-5">
      <div className="pt-2 flex justify-between">
        <Avatar
          onChange={(url) => setAvatar(url)}
          value={avatar}
          field="avatar_url"
          prevValue={account.avatar_url}
        />
        <AccountField
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description ?? ''}
          field="description"
          isTextArea
          prevValue={account.description}
          className="min-h-60"
        />
      </div>
      <div className="flex">
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
        <Input
          label={'Email'}
          onChange={() => console.log('changed')}
          value={account.email}
          isDisabled
          prevValue={account.email}
        />
      </div>
      <div className="flex">
        <AccountField
          label="Weight"
          type="number"
          onChange={(e) => setWeight(e.target.value)}
          value="173"
          field="given_name"
          prevValue={account.given_name}
        />

        <AccountField
          label="Date of Birth"
          type="date"
          onChange={(e) => setDob(e.target.value)}
          value="1997-05-14"
          field="family_name"
          prevValue={account.family_name}
        />
      </div>
      <div className="flex">
        <AccountField
          label="Gender"
          type="select"
          onChange={(e) => setGender(e.target.value)}
          value="Male"
          field="given_name"
          prevValue={account.given_name}
        />

        <AccountField
          label="Height"
          type="number"
          onChange={(e) => setHeight(e.target.value)}
          value="6'0"
          field="family_name"
          prevValue={account.family_name}
        />
      </div>
      <div className="flex">
        <AccountField
          label="City"
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value="Burnaby"
          field="given_name"
          prevValue={account.given_name}
        />

        <AccountField
          label="Country"
          type="text"
          onChange={(e) => setCountry(e.target.value)}
          value="Canada"
          field="family_name"
          prevValue={account.family_name}
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
      <div className="mt-5 flex justify-end">
        <Logout />
      </div>
    </section>
  );
};
