'use client';

import { observer } from 'mobx-react-lite';
import userStore from '@/app/stores/userStore';
import UserCard from '@/app/ui/users/userCard';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

const UsersList = observer(() => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="flex flex-col gap-1">
      <Input
        className="w-full"
        value={searchValue}
        onValueChange={setSearchValue}
        label="Найти пользователя"
        placeholder="landlord@example.com"
        endContent={<SearchIcon className="h-full stroke-default-400" />}
        name="user_search"
        aria-label="user_search"
      />
      <Listbox
        isVirtualized
        virtualization={{ maxListboxHeight: 424, itemHeight: 56 }}
        variant="faded"
      >
        {userStore.allUsers
          .filter(
            (user) =>
              user.email.includes(searchValue) || user.id.includes(searchValue),
          )
          .map(
            (user) =>
              (
                <ListboxItem>
                  <UserCard
                    key={user.id}
                    user={user}
                    onDelete={(id) => console.log('hi')}
                  />
                </ListboxItem>
              ) as any,
          )}
      </Listbox>
    </div>
  );
});

export default UsersList;
