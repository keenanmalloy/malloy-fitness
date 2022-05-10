import React, { useState } from 'react';
import { Avatar } from 'features/account/components/Avatar';
import {
  AccountField,
  AccountSelectField,
} from 'features/account/components/AccountField';
import { Account } from 'features/account//types';

interface Props {
  account: Account;
}

export const AccountPanel = ({ account }: Props) => {
  const [givenName, setGivenName] = useState(account.given_name);
  const [familyName, setFamilyName] = useState(account.family_name);
  const [name, setName] = useState(account.name);
  const [phone, setPhone] = useState(account.phone);
  const [avatar, setAvatar] = useState(account.avatar_url);
  const [weight, setWeight] = useState<string | number>(account.weight);
  const [height, setHeight] = useState<string | number>(account.height);
  const [dob, setDob] = useState(account.dob);
  const [gender, setGender] = useState(account.gender);
  const [city, setCity] = useState(account.city);
  const [country, setCountry] = useState(account.country);

  return (
    <section className="px-5">
      <div className="pt-2 flex justify-center">
        <Avatar
          onChange={(url) => setAvatar(url)}
          value={avatar}
          field="avatar_url"
          prevValue={account.avatar_url}
        />
      </div>
      <div className="flex space-x-2">
        <AccountField
          className="text-white"
          label="First name"
          onChange={(e) => setGivenName(e.target.value)}
          value={givenName}
          field="given_name"
          prevValue={account.given_name}
        />

        <AccountField
          className="text-white"
          label="Last name"
          onChange={(e) => setFamilyName(e.target.value)}
          value={familyName}
          field="family_name"
          prevValue={account.family_name}
        />
      </div>
      <div>
        <AccountField
          className="text-white"
          label="Username"
          onChange={(e) => setName(e.target.value)}
          value={name}
          field="name"
          prevValue={account.name}
        />
      </div>
      <div className="flex space-x-2">
        <AccountSelectField
          label="Gender"
          onChange={(value) => setGender(value)}
          value={gender}
          field="gender"
          prevValue={account.gender}
          options={[
            {
              label: 'prefer not to say',
              value: 'prefer not to say',
            },
            {
              label: 'male',
              value: 'male',
            },
            {
              label: 'female',
              value: 'female',
            },
          ]}
        />

        <AccountField
          className="text-white datepicker form-floating"
          label="Date of Birth"
          type="date"
          onChange={(e) => setDob(e.target.value)}
          value={new Date(dob).toISOString().split('T')[0]}
          field="dob"
          prevValue={account.dob}
        />
      </div>
      <div className="flex space-x-2">
        <AccountField
          className="text-white"
          label="Weight"
          type="number"
          onChange={(e) => setWeight(e.target.value)}
          field="weight"
          value={weight}
          prevValue={account.weight}
        />
        <AccountField
          className="text-white"
          label="Height"
          type="number"
          onChange={(e) => setHeight(e.target.value)}
          value={height}
          field="height"
          prevValue={account.height}
        />
      </div>
      <div className="flex space-x-2">
        <AccountSelectField
          label="Country"
          type="text"
          onChange={(value) => setCountry(value)}
          value={country}
          field="country"
          prevValue={account.country}
          options={[
            {
              label: 'CA',
              value: 'CA',
            },
            {
              label: 'US',
              value: 'US',
            },
          ]}
        />
        <AccountField
          className="text-white"
          label="City"
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          field="city"
          prevValue={account.city}
        />
      </div>
      <div>
        <AccountField
          className="text-white"
          label="Phone number"
          onChange={(e) => setPhone(e.target.value)}
          value={phone ?? ''}
          field="phone"
          prevValue={account.phone}
        />
      </div>
      <small className="text-xs text-gray-300">
        Account created on{' '}
        {new Intl.DateTimeFormat('en-CA', {
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(new Date(account.created_at))}
        .
      </small>
    </section>
  );
};
