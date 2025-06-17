'use client';

import { observer } from 'mobx-react-lite';
import userStore from '@/app/stores/userStore';
import UserCard from '@/app/ui/users/userCard';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import NewUserModal from '@/app/ui/modals/newUserModal';

const UsersList = observer(() => {
  const [searchValue, setSearchValue] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteUser = (id: string) => {
    // TODO: delete request
    userStore.deleteUser(id);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between gap-2">
          <Input
            value={searchValue}
            onValueChange={setSearchValue}
            label="Найти пользователя"
            placeholder="landlord@example.com"
            endContent={<SearchIcon className="h-full stroke-default-400" />}
            name="user_search"
            aria-label="user_search"
          />
          <Button
            onPress={onOpen}
            isIconOnly
            variant="flat"
            color="primary"
            size="lg"
          >
            <UserPlusIcon />
          </Button>
        </div>
        <Listbox
          isVirtualized
          virtualization={{ maxListboxHeight: 588, itemHeight: 56 }}
          variant="faded"
          aria-label="all_users"
        >
          {userStore.allUsers
            .filter(
              (user) =>
                user.email.includes(searchValue) ||
                user.id.includes(searchValue),
            )
            .map(
              (user) =>
                (
                  <ListboxItem key={user.id} textValue={user.email}>
                    <UserCard user={user} onDelete={handleDeleteUser} />
                  </ListboxItem>
                ) as any,
            )}
        </Listbox>
      </div>
      {isOpen && <NewUserModal isOpen={isOpen} onOpenChange={onOpenChange} />}
    </>
  );
});

export default UsersList;
